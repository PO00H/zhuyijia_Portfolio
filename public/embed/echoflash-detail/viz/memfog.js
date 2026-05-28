/**
 * CPU 像素着色器全屏后处理可视化
 * --------------------------------------------------------------
 * 1:1 还原 ECHOFLASH 源码 EffectManager::DrawFogOfWar：
 *
 *   for y in [0, screenH):
 *     for x in [0, screenW):
 *       float vis = BASE_DARKNESS;          // 0.12
 *       vis = max(vis, exploredMap[y*W+x]); // 记忆迷雾残影
 *
 *       // 1. 空间裁剪 (AABB 跳过远像素)
 *       if (|dx| <= waveR && |dy| <= waveR && dx*dx+dy*dy < waveR*waveR) {
 *         // 软边渐变 + 圆环高亮 (圆环方程衰减)
 *         vis = max(vis, computeWaveVisibility(dist, waveR, ringInner));
 *         exploredMap[y*W+x] = max(exploredMap[y*W+x], targetVis);
 *       }
 *
 *       // 2. 主角本地感知 (圆形软边)
 *       if (...) vis = max(vis, computePlayerVis(...));
 *
 *       // 3. 写回 buffer: pixel.rgb *= vis
 *
 * 关键性能技巧：
 *   - AABB 包围盒裁剪（不在 |dx|<=R 范围内的像素直接跳过）
 *   - 用 distSq < radSq 比较代替 sqrt（只在边缘才开根）
 *   - 圆环：distSq > ringInnerSq 检测空心环 (无需 sqrt)
 *
 * 演示：
 *   - 鼠标控制玩家位置（本地感知圆心）
 *   - 每 3.5s 自动从玩家位置发一次声波（扩散到 MAX_WAVE_RAD 自动消失）
 *   - 已照亮区域以更暗的"残影"形式保留（exploredMap 永久存）
 *   - 点 PULSE 立即触发一次声波，点 CLEAR 清空记忆
 *
 * Canvas 内部 320×180 (实际 per-pixel 计算)，CSS 拉伸 2x 显示像素感。
 *
 * 接口：window.VIZ_REGISTRY.memfog = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // ── 渲染分辨率 (per-pixel 跑 60fps 的合理上限) ──
  const W = 320, H = 180;

  // ── 算法常量 ──
  // 4 档对比清晰可辨（底色 200 时：50 / 120 / 170 / 200）:
  //   未探测 (BASE_DARKNESS 0.25) → 200 × 0.25 = 50/255   暗但可见轮廓
  //   记忆残影 (MEMORY_CAP 0.60)   → 200 × 0.60 = 120/255  中灰
  //   实时声波 (~0.85)             → 200 × 0.85 = 170/255  亮
  //   玩家本地 (~1.0)              → 200 × 1.0  = 200/255  最亮
  const BASE_DARKNESS = 0.25;
  const MAX_WAVE_RAD = 140;
  const WAVE_SPEED = 110;
  const WAVE_EDGE = 22;
  const DEFAULT_SENSE_RAD = 42;
  const SENSE_EDGE = 18;

  const WAVE_COOLDOWN_MS = 2500;     // 缩短让用户更快看到第一次声波

  // 残影永久保留（与游戏一致：exploredMap 只 max 不 decay）
  const MEMORY_DECAY_PER_FRAME = 0;
  const MEMORY_CAP = 0.60;

  // ── 底图（"场景"基础颜色，被 vis 调暗）──
  // 我们生成几面"墙" + 一些"目标点"，让 visibility 变化时清晰可见
  function buildBaseMap() {
    const buf = new Uint8ClampedArray(W * H * 3);
    // 默认地面色 (调亮到 200，让"亮起"时对比明显)
    const FLOOR = 0xC8;       // 200
    for (let i = 0; i < W * H; i++) {
      buf[i * 3] = FLOOR;
      buf[i * 3 + 1] = FLOOR;
      buf[i * 3 + 2] = FLOOR;
    }
    // 几面墙（中灰，比地板暗但不至于黑得彻底）
    const walls = [
      { x: 60, y: 30, w: 40, h: 12 },
      { x: 180, y: 50, w: 14, h: 60 },
      { x: 230, y: 130, w: 50, h: 14 },
      { x: 80, y: 110, w: 60, h: 14 },
      { x: 30, y: 130, w: 14, h: 30 },
    ];
    walls.forEach((w) => {
      for (let y = w.y; y < w.y + w.h; y++) {
        for (let x = w.x; x < w.x + w.w; x++) {
          if (x < 0 || x >= W || y < 0 || y >= H) continue;
          const i = (y * W + x) * 3;
          buf[i] = 0x55; buf[i + 1] = 0x55; buf[i + 2] = 0x55;  // 85
        }
      }
    });
    // 几个"目标"（橙红点，代表敌人/可视化物体）
    const dots = [
      { x: 130, y: 70, c: [0xFF, 0x3D, 0x00] },
      { x: 260, y: 90, c: [0xFF, 0x3D, 0x00] },
      { x: 50, y: 160, c: [0xFE, 0xBC, 0x2E] },
    ];
    dots.forEach((d) => {
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (dx * dx + dy * dy > 9) continue;
          const x = d.x + dx, y = d.y + dy;
          if (x < 0 || x >= W || y < 0 || y >= H) continue;
          const i = (y * W + x) * 3;
          buf[i] = d.c[0]; buf[i + 1] = d.c[1]; buf[i + 2] = d.c[2];
        }
      }
    });
    return buf;
  }

  function createState() {
    return {
      running: false,
      raf: 0,
      lastTs: 0,
      player: { x: W * 0.3, y: H * 0.5 },
      senseRad: DEFAULT_SENSE_RAD,
      base: buildBaseMap(),
      exploredMap: new Float32Array(W * H),  // 0..MEMORY_CAP
      // wave
      isWaveActive: false,
      waveCenter: { x: 0, y: 0 },
      waveRadius: 0,
      waveCooldown: WAVE_COOLDOWN_MS * 0.4, // 初始稍短，更快看到第一次声波
      // imageData buffer
      imageData: null,
      pixels: null,
    };
  }

  // ── 核心：CPU 像素着色器主循环 ──
  function shadePixels(state) {
    const px = state.pixels;
    const base = state.base;
    const expMap = state.exploredMap;
    const px_x = state.player.x, px_y = state.player.y;
    const senseR = state.senseRad;
    const senseRsq = senseR * senseR;

    const waveActive = state.isWaveActive;
    let wx = 0, wy = 0, wR = 0, wRsq = 0, ringWidth = 0, ringInnerSq = 0, peakVis = 0;
    if (waveActive) {
      wx = state.waveCenter.x; wy = state.waveCenter.y;
      wR = state.waveRadius; wRsq = wR * wR;
      const lifeRatio = Math.max(0, 1 - wR / MAX_WAVE_RAD);
      ringWidth = 15 * lifeRatio;
      ringInnerSq = (wR - ringWidth) * (wR - ringWidth);
      peakVis = 0.85 + 0.15 * lifeRatio;
    }

    // 自然衰减 expMap
    if (MEMORY_DECAY_PER_FRAME > 0) {
      for (let i = 0; i < expMap.length; i++) {
        if (expMap[i] > 0) {
          expMap[i] -= MEMORY_DECAY_PER_FRAME;
          if (expMap[i] < 0) expMap[i] = 0;
        }
      }
    }

    for (let y = 0; y < H; y++) {
      const dyP = y - px_y;
      const dyW = y - wy;
      for (let x = 0; x < W; x++) {
        let vis = BASE_DARKNESS;
        const mapIdx = y * W + x;

        // 记忆迷雾：从 exploredMap 取历史
        if (expMap[mapIdx] > vis) vis = expMap[mapIdx];

        // 1. 声波（带空间裁剪 + 圆环方程）
        if (waveActive) {
          const dxW = x - wx;
          if (Math.abs(dxW) <= wR && Math.abs(dyW) <= wR) {  // AABB 裁剪
            const distWSq = dxW * dxW + dyW * dyW;
            if (distWSq < wRsq) {
              const distW = Math.sqrt(distWSq);
              let targetVis = 0.85;
              if (wR - distW < WAVE_EDGE) {
                let f = (wR - distW) / WAVE_EDGE;
                if (f < 0) f = 0; if (f > 1) f = 1;
                targetVis = BASE_DARKNESS + (0.85 - BASE_DARKNESS) * f;
              }
              // 更新 exploredMap (capped)
              const memTarget = Math.min(MEMORY_CAP, targetVis);
              if (expMap[mapIdx] < memTarget) expMap[mapIdx] = memTarget;
              if (vis < targetVis) vis = targetVis;
              // 圆环高亮
              if (ringWidth > 0.5 && distWSq > ringInnerSq) {
                const ringFactor = (distW - (wR - ringWidth)) / ringWidth;
                const pxVis = 0.85 + (peakVis - 0.85) * ringFactor;
                if (vis < pxVis) vis = pxVis;
              }
            }
          }
        }

        // 2. 玩家本地感知
        const dxP = x - px_x;
        if (Math.abs(dxP) <= senseR && Math.abs(dyP) <= senseR) {
          const distPSq = dxP * dxP + dyP * dyP;
          if (distPSq < senseRsq) {
            let pVis = 1;
            if (senseRsq - distPSq < (SENSE_EDGE * 2 * senseR)) {
              // 用 sqrt 算精确距离 (仅边缘像素)
              const distP = Math.sqrt(distPSq);
              if (senseR - distP < SENSE_EDGE) {
                let f = (senseR - distP) / SENSE_EDGE;
                if (f < 0) f = 0; if (f > 1) f = 1;
                pVis = BASE_DARKNESS + (1 - BASE_DARKNESS) * f;
              }
            }
            if (pVis > vis) vis = pVis;
          }
        }

        // 3. 像素写回 (rgb *= vis)
        const bi = mapIdx * 3;
        const pi = mapIdx * 4;
        px[pi]     = base[bi]     * vis;
        px[pi + 1] = base[bi + 1] * vis;
        px[pi + 2] = base[bi + 2] * vis;
        px[pi + 3] = 255;
      }
    }
  }

  // ── 主循环 ──
  function loop(container, ts) {
    const state = container._vizState;
    if (!state.running) return;

    const dt = state.lastTs ? Math.min(50, ts - state.lastTs) : 16;
    state.lastTs = ts;

    // 声波 cooldown 倒计时
    if (!state.isWaveActive) {
      state.waveCooldown -= dt;
      if (state.waveCooldown <= 0) {
        triggerWave(state);
      }
    } else {
      // 扩散声波
      state.waveRadius += (WAVE_SPEED * dt) / 1000;
      if (state.waveRadius >= MAX_WAVE_RAD) {
        state.isWaveActive = false;
        state.waveCooldown = WAVE_COOLDOWN_MS;
      }
    }

    shadePixels(state);
    state.ctx.putImageData(state.imageData, 0, 0);

    // 顶部覆盖层（玩家位置 + 状态文字）
    drawOverlay(container);

    state.raf = requestAnimationFrame((t) => loop(container, t));
  }

  function triggerWave(state) {
    state.isWaveActive = true;
    state.waveCenter = { x: state.player.x, y: state.player.y };
    state.waveRadius = 1;
  }

  function drawOverlay(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;   // 顶部覆盖层 canvas（同尺寸）
    ctx.clearRect(0, 0, W, H);

    // 玩家位置标记（橙色十字 + 圆）
    const px = state.player.x, py = state.player.y;
    ctx.strokeStyle = '#FF3D00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.stroke();
    // 玩家感知半径（细虚线圈）
    ctx.strokeStyle = 'rgba(255,61,0,0.4)';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.arc(px, py, state.senseRad, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 声波圈（亮黄边）
    if (state.isWaveActive) {
      ctx.strokeStyle = 'rgba(254,188,46,0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(state.waveCenter.x, state.waveCenter.y, state.waveRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 顶部信息
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#FF3D00';
    ctx.fillText('PIXEL SHADER', 6, 4);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#8a8a85';
    const pixelCount = W * H;
    const status = state.isWaveActive
      ? `WAVE r=${state.waveRadius.toFixed(0)} · ${pixelCount}px/frame`
      : `IDLE · pulse in ${Math.max(0, state.waveCooldown / 1000).toFixed(1)}s`;
    ctx.fillText(status, W - 6, 4);
    ctx.textAlign = 'left';

    // 底部图例：4 档亮度对比说明（让用户一眼看出"未探测 vs 已探测"）
    const legendY = H - 12;
    const legendX = 6;
    const SAMPLE = 200;  // 底色 #C8 = 200
    function legendItem(x, vis, label) {
      const v = Math.round(SAMPLE * vis);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, legendY, 8, 8);
      ctx.strokeStyle = '#3a3a3a';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x + 0.5, legendY + 0.5, 7, 7);
      ctx.fillStyle = '#8a8a85';
      ctx.fillText(label, x + 10, legendY + 1);
      return x + 10 + ctx.measureText(label).width + 8;
    }
    let lx = legendX;
    lx = legendItem(lx, BASE_DARKNESS, 'unseen');
    lx = legendItem(lx, MEMORY_CAP, 'memory');
    lx = legendItem(lx, 0.88, 'wave');
    lx = legendItem(lx, 1.0, 'local');
  }

  // ── CONTROLS ──
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="pulse">▶ PULSE</button>
      <button class="viz-btn" data-act="clear">CLEAR FOG</button>
      <div style="display:flex;align-items:center;gap:.5rem;flex:1;min-width:200px">
        <label style="color:var(--fg-dim);letter-spacing:.05em">SENSE RADIUS</label>
        <input type="range" min="16" max="80" step="2" value="${state.senseRad}" style="accent-color:var(--accent);flex:1" />
        <span class="r-val" style="color:var(--fg);min-width:32px;text-align:right">${state.senseRad}<small style="color:var(--fg-mute)">px</small></span>
      </div>
      <div style="color:var(--fg-dim)">
        <span style="color:var(--fg-dim)">hint:</span>
        <span style="color:var(--fg)">move cursor in scene</span>
      </div>
    `;
    container.appendChild(wrap);

    wrap.querySelector('[data-act="pulse"]').addEventListener('click', () => {
      triggerWave(state);
    });
    wrap.querySelector('[data-act="clear"]').addEventListener('click', () => {
      state.exploredMap.fill(0);
    });

    const slider = wrap.querySelector('input[type=range]');
    const val = wrap.querySelector('.r-val');
    slider.addEventListener('input', () => {
      state.senseRad = parseInt(slider.value, 10);
      val.firstChild.nodeValue = slider.value;
    });
    slider.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
  }

  // ── MOUNT ──
  function mount(container) {
    container.innerHTML = '';

    // 创建一个 wrapper 容纳"像素层 + 顶部覆盖层" 两个 canvas
    const stage = document.createElement('div');
    stage.style.cssText = `position:relative;width:100%;max-width:${W * 2}px;margin:0 auto;aspect-ratio:${W}/${H};image-rendering:pixelated;border-radius:2px;overflow:hidden;background:#000`;
    container.appendChild(stage);

    // 像素层（实际 putImageData 写入）
    const pixelCanvas = document.createElement('canvas');
    pixelCanvas.width = W;
    pixelCanvas.height = H;
    pixelCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated';
    stage.appendChild(pixelCanvas);
    const ctx = pixelCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // 顶部覆盖层（玩家光标 + 文字。物理尺寸同 W×H，CSS 拉伸跟随）
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = W;
    overlayCanvas.height = H;
    overlayCanvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated';
    stage.appendChild(overlayCanvas);
    const overlayCtx = overlayCanvas.getContext('2d');

    const state = createState();
    state.imageData = ctx.createImageData(W, H);
    state.pixels = state.imageData.data;
    state.ctx = ctx;
    state.container = container;
    container._vizCanvas = pixelCanvas;
    container._vizCtx = overlayCtx;     // 顶部覆盖层 ctx（drawOverlay 用）
    container._vizState = state;

    buildControls(container, state);

    // 鼠标 / 触屏 → 控制玩家位置
    const updatePlayer = (clientX, clientY) => {
      const rect = stage.getBoundingClientRect();
      const sx = W / rect.width;
      state.player.x = Math.max(0, Math.min(W, (clientX - rect.left) * sx));
      state.player.y = Math.max(0, Math.min(H, (clientY - rect.top) * sx));
    };
    stage.addEventListener('mousemove', (e) => updatePlayer(e.clientX, e.clientY));
    stage.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        updatePlayer(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    }, { passive: false });
    stage.addEventListener('touchstart', (e) => {
      if (e.touches[0]) updatePlayer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    stage.style.cursor = 'crosshair';

    state.running = true;
    // 同步画第一帧（不依赖 RAF）— 让用户立刻看到画面，
    // 也避免 iframe 在某些情况下 RAF 第一次 tick 延迟过久
    shadePixels(state);
    state.ctx.putImageData(state.imageData, 0, 0);
    drawOverlay(container);
    state.raf = requestAnimationFrame((ts) => loop(container, ts));
  }

  function pause(container) {
    const s = container._vizState;
    if (!s) return;
    s.running = false;
    if (s.raf) {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    }
  }

  function resume(container) {
    const s = container._vizState;
    if (!s || s.running) return;
    s.running = true;
    s.lastTs = 0;
    s.raf = requestAnimationFrame((ts) => loop(container, ts));
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.memfog = { mount, pause, resume };
})();
