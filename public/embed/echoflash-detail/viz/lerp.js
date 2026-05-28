/**
 * 电影级阻尼运镜可视化 (Lerp 线性插值)
 * --------------------------------------------------------------
 * 还原 ECHOFLASH 渲染主循环里的相机偏移 setorigin(-camX, -camY)。
 * camX/camY 不是每帧锁死跟随玩家，而是用 Lerp 平滑追：
 *
 *   camera.x += (player.x - camera.x) * LERP_FACTOR;
 *   camera.y += (player.y - camera.y) * LERP_FACTOR;
 *
 *   LERP_FACTOR 越小 → 滞后越大、运镜越"重"
 *   LERP_FACTOR 1.0 → 等同于硬跟随
 *
 * 演示采用上下分屏对比：
 *   ┌──── HARD FOLLOW (camera = player) ────┐
 *   │   player 始终位于视口正中，世界刚性同步     │
 *   ├────────────────────────────────────────┤
 *   │   LERP FOLLOW (camera += Δ * t)        │
 *   │   player 在视口内偏移；相机有"追焦延迟"    │
 *   └────────────────────────────────────────┘
 *
 * 鼠标 / 触屏在画面内移动 → 控制 world 中玩家的位置
 * 快速画圆 → 上半完全锁定，下半玩家位置随速度甩出"惯性"
 *
 * Slider 控制 LERP_FACTOR (0.04 - 0.5)
 *
 * 接口：window.VIZ_REGISTRY.lerp = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  const W = 640, VIEW_H = 150, GUTTER = 8;
  const H = VIEW_H * 2 + GUTTER;       // 308

  const WORLD_W = 1400, WORLD_H = 800;

  // 玩家位置（world coords），由鼠标控制
  const DEFAULT_LERP = 0.12;

  const C_BG = '#161616';
  const C_VIEWPORT_BG = '#1a1a1a';
  const C_GRID = '#252525';
  const C_GRID_HI = '#2d2d2d';
  const C_GUTTER = '#0e0e0e';
  const C_ACCENT = '#FF3D00';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';

  // ─ 几个 world 内的"地标"作为运镜参考 ─
  const LANDMARKS = [
    { x: 200, y: 200, r: 30, label: 'A' },
    { x: 700, y: 150, r: 40, label: 'B' },
    { x: 1100, y: 400, r: 50, label: 'C' },
    { x: 400, y: 550, r: 35, label: 'D' },
    { x: 950, y: 650, r: 45, label: 'E' },
  ];

  function createState() {
    return {
      running: false,
      raf: 0,
      lerpFactor: DEFAULT_LERP,
      // world coords
      player: { x: 400, y: 400 },
      // 两个相机
      hardCam: { x: 400, y: 400 },
      lerpCam: { x: 400, y: 400 },
      // 鼠标位置（canvas screen coords）
      mouseCanvas: { x: W / 2, y: VIEW_H / 2 },
      // 玩家在 world 中的速度（用于显示）
      lastPlayerX: 400, lastPlayerY: 400,
      speed: 0,
    };
  }

  // 把 canvas 内的鼠标位置映射到 world 玩家位置
  // 使用"上半 hard 视口的相机"作映射（这样玩家移动跟鼠标 1:1 直观）
  function mouseToWorld(state) {
    return {
      x: state.mouseCanvas.x - W / 2 + state.hardCam.x,
      y: state.mouseCanvas.y - VIEW_H / 2 + state.hardCam.y,
    };
  }

  function clampWorld(p) {
    return {
      x: Math.max(0, Math.min(WORLD_W, p.x)),
      y: Math.max(0, Math.min(WORLD_H, p.y)),
    };
  }

  function tick(state) {
    // 玩家 = 鼠标对应的 world 坐标（限制在世界范围内）
    if (state.mouseCanvas.y <= VIEW_H) {
      // 鼠标在上半视口里，按 hard cam 算
      const wp = clampWorld(mouseToWorld(state));
      state.player.x = wp.x;
      state.player.y = wp.y;
    } else {
      // 鼠标在下半 (lerp 视口里) — 仍用 hard cam 当锚点 (避免反馈循环)
      const sy = state.mouseCanvas.y - VIEW_H - GUTTER;
      if (sy >= 0) {
        const wp = clampWorld({
          x: state.mouseCanvas.x - W / 2 + state.hardCam.x,
          y: sy - VIEW_H / 2 + state.hardCam.y,
        });
        state.player.x = wp.x;
        state.player.y = wp.y;
      }
    }

    // 速度（screen px/frame）用于显示
    const dx = state.player.x - state.lastPlayerX;
    const dy = state.player.y - state.lastPlayerY;
    state.speed = Math.hypot(dx, dy);
    state.lastPlayerX = state.player.x;
    state.lastPlayerY = state.player.y;

    // 1) 硬跟随 — 相机立刻 = 玩家
    state.hardCam.x = state.player.x;
    state.hardCam.y = state.player.y;

    // 2) Lerp 跟随 — 与源码相同公式
    state.lerpCam.x += (state.player.x - state.lerpCam.x) * state.lerpFactor;
    state.lerpCam.y += (state.player.y - state.lerpCam.y) * state.lerpFactor;
  }

  // 画一个 world 内的元素 (网格 + 地标 + 玩家)，但根据 camera 偏移
  function drawWorldViewport(ctx, camX, camY, vpX, vpY, vpW, vpH, label, isHard, state) {
    // 视口边界 clip
    ctx.save();
    ctx.beginPath();
    ctx.rect(vpX, vpY, vpW, vpH);
    ctx.clip();

    // 视口背景
    ctx.fillStyle = C_VIEWPORT_BG;
    ctx.fillRect(vpX, vpY, vpW, vpH);

    // World 内偏移：把 (camX - vpW/2) 对齐到 (vpX, vpY) 角
    const offX = vpX - camX + vpW / 2;
    const offY = vpY - camY + vpH / 2;

    // 网格 (每 60px 一根)
    const GS = 60;
    const startGX = Math.floor((camX - vpW / 2) / GS) * GS;
    const endGX = camX + vpW / 2;
    const startGY = Math.floor((camY - vpH / 2) / GS) * GS;
    const endGY = camY + vpH / 2;
    ctx.lineWidth = 1;
    for (let gx = startGX; gx <= endGX; gx += GS) {
      const sx = gx + offX;
      ctx.strokeStyle = (gx % 240 === 0) ? C_GRID_HI : C_GRID;
      ctx.beginPath();
      ctx.moveTo(sx, vpY);
      ctx.lineTo(sx, vpY + vpH);
      ctx.stroke();
    }
    for (let gy = startGY; gy <= endGY; gy += GS) {
      const sy = gy + offY;
      ctx.strokeStyle = (gy % 240 === 0) ? C_GRID_HI : C_GRID;
      ctx.beginPath();
      ctx.moveTo(vpX, sy);
      ctx.lineTo(vpX + vpW, sy);
      ctx.stroke();
    }

    // 世界边界（暗红色矩形）
    ctx.strokeStyle = 'rgba(255,61,0,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(offX, offY, WORLD_W, WORLD_H);

    // 地标
    LANDMARKS.forEach((lm) => {
      const sx = lm.x + offX;
      const sy = lm.y + offY;
      // 视口内才画
      if (sx + lm.r < vpX || sx - lm.r > vpX + vpW) return;
      if (sy + lm.r < vpY || sy - lm.r > vpY + vpH) return;
      ctx.fillStyle = 'rgba(254,188,46,0.12)';
      ctx.beginPath();
      ctx.arc(sx, sy, lm.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(254,188,46,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, lm.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FEBC2E';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lm.label, sx, sy);
    });

    // 玩家（橙色方块）
    const pxX = state.player.x + offX;
    const pxY = state.player.y + offY;
    ctx.fillStyle = C_ACCENT;
    ctx.fillRect(pxX - 5, pxY - 5, 10, 10);
    ctx.strokeStyle = '#ffb380';
    ctx.lineWidth = 1;
    ctx.strokeRect(pxX - 5 + 0.5, pxY - 5 + 0.5, 9, 9);

    // 在 Lerp 视口里，画一条线从 camera 中心 (画面中心) → 玩家，展示"延迟"
    if (!isHard) {
      const cx = vpX + vpW / 2;
      const cy = vpY + vpH / 2;
      const dx = pxX - cx;
      const dy = pxY - cy;
      const lag = Math.hypot(dx, dy);
      if (lag > 4) {
        ctx.strokeStyle = 'rgba(254,188,46,0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pxX, pxY);
        ctx.stroke();
        ctx.setLineDash([]);
        // 写 lag
        ctx.fillStyle = '#FEBC2E';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`lag ${lag.toFixed(0)}px`, (cx + pxX) / 2 + 4, (cy + pxY) / 2 + 4);
      }
      // 画 camera 中心十字
      ctx.strokeStyle = 'rgba(254,188,46,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5);
      ctx.stroke();
    }

    ctx.restore();

    // 标签
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = isHard ? C_ACCENT : '#FEBC2E';
    ctx.fillText(label, vpX + 8, vpY + 6);
    // 视口边框
    ctx.strokeStyle = isHard ? 'rgba(255,61,0,0.3)' : 'rgba(254,188,46,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vpX + 0.5, vpY + 0.5, vpW - 1, vpH - 1);
  }

  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 上半：硬跟随
    drawWorldViewport(ctx, state.hardCam.x, state.hardCam.y, 0, 0, W, VIEW_H, 'HARD FOLLOW · camera = player', true, state);

    // 中间隔条
    ctx.fillStyle = C_GUTTER;
    ctx.fillRect(0, VIEW_H, W, GUTTER);

    // 下半：Lerp
    drawWorldViewport(ctx, state.lerpCam.x, state.lerpCam.y, 0, VIEW_H + GUTTER, W, VIEW_H, `LERP FOLLOW · t = ${state.lerpFactor.toFixed(2)}`, false, state);

    // 顶部右侧速度显示
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_DIM;
    ctx.fillText(`player speed ${state.speed.toFixed(1)} px/frame`, W - 8, 6);
  }

  function loop(container) {
    const state = container._vizState;
    if (!state.running) return;
    tick(state);
    draw(container);
    state.raf = requestAnimationFrame(() => loop(container));
  }

  // ── CONTROLS ──
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem;flex:1;min-width:240px">
        <label style="color:var(--fg-dim);letter-spacing:.05em">LERP&nbsp;t</label>
        <input type="range" min="0.04" max="1.0" step="0.02" value="${state.lerpFactor}" style="accent-color:var(--accent);flex:1" />
        <span class="t-val" style="color:var(--fg);min-width:42px;text-align:right">${state.lerpFactor.toFixed(2)}</span>
      </div>
      <button class="viz-btn" data-act="preset-soft">SOFT 0.06</button>
      <button class="viz-btn" data-act="preset-default">DEFAULT 0.15</button>
      <button class="viz-btn" data-act="preset-hard">HARD 1.0</button>
    `;
    container.appendChild(wrap);

    const slider = wrap.querySelector('input[type=range]');
    const val = wrap.querySelector('.t-val');
    const setT = (t) => {
      state.lerpFactor = t;
      slider.value = t;
      val.textContent = t.toFixed(2);
    };
    slider.addEventListener('input', () => setT(parseFloat(slider.value)));
    slider.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    wrap.querySelector('[data-act="preset-soft"]').addEventListener('click', () => setT(0.06));
    wrap.querySelector('[data-act="preset-default"]').addEventListener('click', () => setT(0.15));
    wrap.querySelector('[data-act="preset-hard"]').addEventListener('click', () => setT(1.0));
  }

  // ── MOUNT ──
  function mount(container) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.cssText = `display:block;width:100%;height:auto;max-width:${W}px;margin:0 auto;border-radius:2px;touch-action:none;cursor:crosshair`;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const state = createState();
    state.container = container;
    container._vizCtx = ctx;
    container._vizCanvas = canvas;
    container._vizState = state;

    buildControls(container, state);

    // 鼠标 → mouseCanvas (CSS 坐标系)
    const updateMouse = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width;
      state.mouseCanvas.x = (clientX - rect.left) * sx;
      state.mouseCanvas.y = (clientY - rect.top) * sx;
    };
    canvas.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches[0]) { updateMouse(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }
    }, { passive: false });

    state.running = true;
    draw(container);
    state.raf = requestAnimationFrame(() => loop(container));
  }

  function pause(container) {
    const s = container._vizState;
    if (!s) return;
    s.running = false;
    if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
  }
  function resume(container) {
    const s = container._vizState;
    if (!s || s.running) return;
    s.running = true;
    s.raf = requestAnimationFrame(() => loop(container));
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.lerp = { mount, pause, resume };
})();
