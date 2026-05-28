/**
 * 电影级阻尼运镜可视化 (Lerp 线性插值)
 * --------------------------------------------------------------
 * 还原 ECHOFLASH 主循环 setorigin(-camX, -camY) 的相机偏移。
 * camX/camY 每帧用 Lerp 追玩家：
 *
 *   camera.x += (player.x - camera.x) * LERP_FACTOR;
 *   camera.y += (player.y - camera.y) * LERP_FACTOR;
 *
 * 演示采用左右分屏对比：
 *   ┌── HARD FOLLOW ──┐ ┌── LERP FOLLOW ──┐
 *   │ camera = player │ │ camera += Δ * t  │
 *   │ 玩家始终居中    │ │ 玩家偏离中心 = lag │
 *   └─────────────────┘ └──────────────────┘
 *
 * 鼠标 / 触屏在画面内移动 → 控制 world 中玩家的位置
 * 鼠标灵敏度 = 0.5 (鼠标移动 100px 玩家在世界中移动 50px)
 *
 * Slider 控制 LERP_FACTOR，默认 0.5
 *
 * 接口：window.VIZ_REGISTRY.lerp = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // 画布尺寸：左右分屏
  const W = 660, H = 300;
  const GUTTER = 8;
  const VIEW_W = (W - GUTTER) / 2;     // 326
  const VIEW_H = H;

  // World 尺寸 (比单个 viewport 大很多，让相机移动可见)
  const WORLD_W = 1400, WORLD_H = 1000;
  const WORLD_CX = WORLD_W / 2;
  const WORLD_CY = WORLD_H / 2;

  const DEFAULT_LERP = 0.5;
  const MOUSE_SENSITIVITY = 1.0;       // 鼠标 → 玩家移动量的比例 (1:1)

  const C_BG = '#161616';
  const C_VIEWPORT_BG = '#1a1a1a';
  const C_GRID = '#252525';
  const C_GRID_HI = '#2d2d2d';
  const C_GUTTER = '#0e0e0e';
  const C_ACCENT = '#FF3D00';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';

  // 几个 world 地标
  const LANDMARKS = [
    { x: 350, y: 280, r: 35, label: 'A' },
    { x: 850, y: 220, r: 45, label: 'B' },
    { x: 1180, y: 520, r: 50, label: 'C' },
    { x: 500, y: 680, r: 38, label: 'D' },
    { x: 1000, y: 800, r: 42, label: 'E' },
    { x: 200, y: 500, r: 28, label: 'F' },
  ];

  function createState() {
    return {
      running: false,
      raf: 0,
      lerpFactor: DEFAULT_LERP,
      player: { x: WORLD_CX, y: WORLD_CY },
      hardCam: { x: WORLD_CX, y: WORLD_CY },
      lerpCam: { x: WORLD_CX, y: WORLD_CY },
      mouseCanvas: { x: W / 2, y: H / 2 },
      lastPlayerX: WORLD_CX, lastPlayerY: WORLD_CY,
      speed: 0,
    };
  }

  function tick(state) {
    // 1) 由鼠标在 canvas 中的偏移驱动玩家在 world 的位置
    //    鼠标在画布正中 → 玩家在 world 中心
    //    鼠标偏移 N px → 玩家偏移 N * MOUSE_SENSITIVITY px
    //    鼠标在哪个视口里都用同一套规则（取 mouseCanvas 减 W/2、H/2）
    const dx = (state.mouseCanvas.x - W / 2) * MOUSE_SENSITIVITY;
    const dy = (state.mouseCanvas.y - H / 2) * MOUSE_SENSITIVITY;
    state.player.x = Math.max(0, Math.min(WORLD_W, WORLD_CX + dx));
    state.player.y = Math.max(0, Math.min(WORLD_H, WORLD_CY + dy));

    state.speed = Math.hypot(state.player.x - state.lastPlayerX, state.player.y - state.lastPlayerY);
    state.lastPlayerX = state.player.x;
    state.lastPlayerY = state.player.y;

    // 2) 硬跟随
    state.hardCam.x = state.player.x;
    state.hardCam.y = state.player.y;

    // 3) Lerp 阻尼
    state.lerpCam.x += (state.player.x - state.lerpCam.x) * state.lerpFactor;
    state.lerpCam.y += (state.player.y - state.lerpCam.y) * state.lerpFactor;
  }

  function drawWorldViewport(ctx, camX, camY, vpX, vpY, vpW, vpH, label, isHard, state) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(vpX, vpY, vpW, vpH);
    ctx.clip();

    ctx.fillStyle = C_VIEWPORT_BG;
    ctx.fillRect(vpX, vpY, vpW, vpH);

    // world → screen 偏移：让 (camX, camY) 出现在视口中心
    const offX = vpX - camX + vpW / 2;
    const offY = vpY - camY + vpH / 2;

    // 网格
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

    // World 边界
    ctx.strokeStyle = 'rgba(255,61,0,0.22)';
    ctx.lineWidth = 1;
    ctx.strokeRect(offX, offY, WORLD_W, WORLD_H);

    // 地标
    LANDMARKS.forEach((lm) => {
      const sx = lm.x + offX;
      const sy = lm.y + offY;
      if (sx + lm.r < vpX || sx - lm.r > vpX + vpW) return;
      if (sy + lm.r < vpY || sy - lm.r > vpY + vpH) return;
      ctx.fillStyle = 'rgba(254,188,46,0.1)';
      ctx.beginPath();
      ctx.arc(sx, sy, lm.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(254,188,46,0.4)';
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

    // 玩家 (橙色方块)
    const pxX = state.player.x + offX;
    const pxY = state.player.y + offY;
    ctx.fillStyle = C_ACCENT;
    ctx.fillRect(pxX - 5, pxY - 5, 10, 10);
    ctx.strokeStyle = '#ffb380';
    ctx.lineWidth = 1;
    ctx.strokeRect(pxX - 5 + 0.5, pxY - 5 + 0.5, 9, 9);

    // 在 lerp 视口里，画 camera 十字 + 滞后线
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
        ctx.fillStyle = '#FEBC2E';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`lag ${lag.toFixed(0)}px`, (cx + pxX) / 2 + 4, (cy + pxY) / 2 + 4);
      }
      // camera 中心十字
      ctx.strokeStyle = 'rgba(254,188,46,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy); ctx.lineTo(cx + 5, cy);
      ctx.moveTo(cx, cy - 5); ctx.lineTo(cx, cy + 5);
      ctx.stroke();
    }

    ctx.restore();

    // 视口边框 + 标签
    ctx.strokeStyle = isHard ? 'rgba(255,61,0,0.3)' : 'rgba(254,188,46,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vpX + 0.5, vpY + 0.5, vpW - 1, vpH - 1);

    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = isHard ? C_ACCENT : '#FEBC2E';
    ctx.fillText(label, vpX + 8, vpY + 8);
  }

  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 左视口：HARD
    drawWorldViewport(ctx, state.hardCam.x, state.hardCam.y,
      0, 0, VIEW_W, VIEW_H,
      'HARD · camera = player',
      true, state);

    // 中间 gutter
    ctx.fillStyle = C_GUTTER;
    ctx.fillRect(VIEW_W, 0, GUTTER, H);

    // 右视口：LERP
    drawWorldViewport(ctx, state.lerpCam.x, state.lerpCam.y,
      VIEW_W + GUTTER, 0, VIEW_W, VIEW_H,
      `LERP · t = ${state.lerpFactor.toFixed(2)}`,
      false, state);

    // 底部速度显示（跨整个 canvas）
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = C_DIM;
    ctx.fillText(`player speed ${state.speed.toFixed(1)} px/frame · sensitivity ${MOUSE_SENSITIVITY}`, W - 8, H - 8);
  }

  function loop(container) {
    const state = container._vizState;
    if (!state.running) return;
    tick(state);
    draw(container);
    state.raf = requestAnimationFrame(() => loop(container));
  }

  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem;flex:1;min-width:240px">
        <label style="color:var(--fg-dim);letter-spacing:.05em">LERP&nbsp;t</label>
        <input type="range" min="0.04" max="1.0" step="0.02" value="${state.lerpFactor}" style="accent-color:var(--accent);flex:1" />
        <span class="t-val" style="color:var(--fg);min-width:42px;text-align:right">${state.lerpFactor.toFixed(2)}</span>
      </div>
      <button class="viz-btn" data-act="preset-soft">SOFT 0.08</button>
      <button class="viz-btn" data-act="preset-default">DEFAULT 0.5</button>
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
    wrap.querySelector('[data-act="preset-soft"]').addEventListener('click', () => setT(0.08));
    wrap.querySelector('[data-act="preset-default"]').addEventListener('click', () => setT(0.5));
    wrap.querySelector('[data-act="preset-hard"]').addEventListener('click', () => setT(1.0));
  }

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
