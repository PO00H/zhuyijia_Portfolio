/**
 * 零漂移摇杆补偿可视化（相位偏移防抖）
 * --------------------------------------------------------------
 * 1:1 还原 ECHOFLASH 源码 Player::UpdateAnimationState 的方向解算：
 *
 *   float angle = rotationAngle;
 *   if (angle < 0) angle += 2π;
 *   angle += π/8;                       // 相位偏移 22.5°
 *   if (angle >= 2π) angle -= 2π;
 *   currentDir = (int)(angle / (π/4));  // 0..7 共 8 个扇区
 *
 * 关键：+π/8 偏移把"正向"锁在每个扇区的"中心"，而不是边界。
 *      当摇杆/鼠标在正向附近做小幅度抖动时，方向不会在两个扇区间反复跳变。
 *
 * 演示：左右分屏对比
 *   ┌── NO OFFSET ──┐ ┌── WITH OFFSET (+22.5°) ──┐
 *   │ 扇区 0 边界落在正向上     │ │ 扇区 0 中心在正向         │
 *   │ 微抖会让 dir 跳 7↔0       │ │ dir 稳定 = 0              │
 *   └────────────────┘ └──────────────────────────┘
 *
 *   下方 JITTER 计数器：累计两种版本各自的 dir 切换次数（防抖效果立竿见影）
 *
 * 交互：
 *   - 鼠标 / 触屏在画布内移动 → 控制 rotationAngle
 *   - JITTER 按钮 → 模拟手抖 (每帧给 angle 加 ±5° 高斯噪声)
 *   - RESET COUNT → 清零切换计数器
 *
 * 接口：window.VIZ_REGISTRY.deadzone = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // 单视口 (只保留带偏移版本)
  const W = 380, H = 360;
  const VIEW_W = W;
  const VIEW_H = H;

  const DISC_RADIUS = 118;
  const PI = Math.PI;
  const PI_8 = PI / 8;
  const PI_4 = PI / 4;

  const DIR_LABELS = ['→ E','↘ SE','↓ S','↙ SW','← W','↖ NW','↑ N','↗ NE'];

  const C_BG = '#161616';
  const C_VIEWPORT = '#1a1a1a';
  const C_DISC = '#222';
  const C_DIVIDER = '#2a2a2a';
  const C_HI = '#FF3D00';
  const C_HI_FILL = 'rgba(255,61,0,0.18)';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';
  const C_GUTTER = '#0e0e0e';
  const C_YELLOW = '#FEBC2E';

  function computeDir(angle, useOffset) {
    if (angle < 0) angle += 2 * PI;
    if (useOffset) angle += PI_8;
    if (angle >= 2 * PI) angle -= 2 * PI;
    return Math.floor(angle / PI_4);
  }

  function createState() {
    return {
      running: false,
      raf: 0,
      rawAngle: 0,           // 鼠标 → 玩家中心的角度（裸角度，不偏移）
      jitter: false,
      // 各自的方向 + 切换计数
      dirNoOffset: 0,
      dirWithOffset: 0,
      lastDirNo: -1,
      lastDirYes: -1,
      countNoOffset: 0,
      countWithOffset: 0,
      mouseCanvas: { x: W / 2, y: H / 2 },
    };
  }

  function tick(state) {
    const cx = W / 2;
    const cy = H / 2;
    const dx = state.mouseCanvas.x - cx;
    const dy = state.mouseCanvas.y - cy;
    let a = Math.atan2(dy, dx);

    // 模拟手抖：每帧加 ±5° 高斯噪声 (用 box-muller 简化)
    if (state.jitter) {
      const noise = (Math.random() - 0.5 + Math.random() - 0.5) * (PI / 36); // ±5°
      a += noise;
    }
    state.rawAngle = a;

    const dn = computeDir(a, false);
    const dy_ = computeDir(a, true);

    if (dn !== state.lastDirNo && state.lastDirNo !== -1) state.countNoOffset++;
    if (dy_ !== state.lastDirYes && state.lastDirYes !== -1) state.countWithOffset++;

    state.lastDirNo = dn;
    state.lastDirYes = dy_;
    state.dirNoOffset = dn;
    state.dirWithOffset = dy_;
  }

  // 画一个 8 扇区圆盘
  function drawDisc(ctx, cx, cy, currentDir, useOffset, state, title) {
    // 圆盘底
    ctx.fillStyle = C_DISC;
    ctx.beginPath();
    ctx.arc(cx, cy, DISC_RADIUS, 0, 2 * PI);
    ctx.fill();

    // 8 个扇区
    for (let i = 0; i < 8; i++) {
      const startA = (useOffset ? -PI_8 : 0) + i * PI_4;
      const endA   = startA + PI_4;

      if (i === currentDir) {
        ctx.fillStyle = C_HI_FILL;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, DISC_RADIUS, startA, endA);
        ctx.closePath();
        ctx.fill();
      }

      // 扇区边界线
      ctx.strokeStyle = C_DIVIDER;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(startA) * DISC_RADIUS, cy + Math.sin(startA) * DISC_RADIUS);
      ctx.stroke();
    }

    // 当前扇区的两条边界线高亮
    {
      const startA = (useOffset ? -PI_8 : 0) + currentDir * PI_4;
      const endA = startA + PI_4;
      ctx.strokeStyle = C_HI;
      ctx.lineWidth = 1.5;
      [startA, endA].forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * DISC_RADIUS, cy + Math.sin(a) * DISC_RADIUS);
        ctx.stroke();
      });
    }

    // 中心标记 + 当前方向箭头
    const a = state.rawAngle;
    ctx.strokeStyle = C_HI;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * (DISC_RADIUS - 18), cy + Math.sin(a) * (DISC_RADIUS - 18));
    ctx.stroke();
    // 箭头头
    const tipX = cx + Math.cos(a) * (DISC_RADIUS - 18);
    const tipY = cy + Math.sin(a) * (DISC_RADIUS - 18);
    const wingA = a + 2.6, wingB = a - 2.6;
    ctx.fillStyle = C_HI;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX + Math.cos(wingA) * 8, tipY + Math.sin(wingA) * 8);
    ctx.lineTo(tipX + Math.cos(wingB) * 8, tipY + Math.sin(wingB) * 8);
    ctx.closePath();
    ctx.fill();

    // 玩家中心圆
    ctx.fillStyle = C_HI;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * PI);
    ctx.fill();

    // 扇区编号 (画在圆环外)
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < 8; i++) {
      const a = (useOffset ? -PI_8 : 0) + (i + 0.5) * PI_4;
      const lx = cx + Math.cos(a) * (DISC_RADIUS + 14);
      const ly = cy + Math.sin(a) * (DISC_RADIUS + 14);
      ctx.fillStyle = (i === currentDir) ? C_HI : C_DIM;
      ctx.fillText(String(i), lx, ly);
    }

    // 顶部标题 + 当前 dir + 切换次数
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_DIM;
    ctx.fillText(title, cx - VIEW_W / 2 + 12, 10);

    ctx.textAlign = 'right';
    ctx.fillStyle = C_HI;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    const cnt = useOffset ? state.countWithOffset : state.countNoOffset;
    ctx.fillText(`dir ${currentDir}`, cx + VIEW_W / 2 - 12, 8);
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = cnt > 0 && state.jitter ? C_YELLOW : C_DIM;
    ctx.fillText(`switches ${cnt}`, cx + VIEW_W / 2 - 12, 24);

    // 底部说明：当前扇区的中心角度 + 该扇区的角度范围
    const dirCenterDeg = ((useOffset ? -PI_8 : 0) + (currentDir + 0.5) * PI_4) * 180 / PI;
    const dirLabel = DIR_LABELS[currentDir];
    ctx.textAlign = 'center';
    ctx.fillStyle = C_FG;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(dirLabel, cx, cy + DISC_RADIUS + 36);
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    ctx.fillText(`center ${normDeg(dirCenterDeg).toFixed(0)}°`, cx, cy + DISC_RADIUS + 52);
  }

  function normDeg(d) {
    d = d % 360;
    if (d < 0) d += 360;
    return d;
  }

  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C_VIEWPORT;
    ctx.fillRect(0, 0, W, H);

    drawDisc(ctx, W / 2, H / 2, state.dirWithOffset, true, state, 'WITH OFFSET +22.5° · center-aligned');

    // 视口边框
    ctx.strokeStyle = 'rgba(254,188,46,0.22)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    // 底部状态条
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = state.jitter ? C_YELLOW : C_DIM;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(state.jitter ? '◉ JITTER ±5°' : '◯ steady', 8, H - 6);
    ctx.textAlign = 'right';
    const deg = normDeg(state.rawAngle * 180 / PI).toFixed(1);
    ctx.fillStyle = C_DIM;
    ctx.fillText(`${deg}°`, W - 8, H - 6);
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
      <button class="viz-btn" data-act="jitter">▶ TOGGLE JITTER</button>
      <button class="viz-btn" data-act="reset">RESET COUNT</button>
      <div style="color:var(--fg-dim);flex:1;text-align:right">
        <span style="color:var(--fg-dim)">hint:</span>
        <span style="color:var(--fg)">move cursor; press JITTER to simulate trembling hand</span>
      </div>
    `;
    container.appendChild(wrap);
    const jBtn = wrap.querySelector('[data-act="jitter"]');
    jBtn.addEventListener('click', () => {
      state.jitter = !state.jitter;
      jBtn.textContent = state.jitter ? '◼ STOP JITTER' : '▶ TOGGLE JITTER';
      jBtn.style.background = state.jitter ? 'var(--accent)' : 'transparent';
      jBtn.style.color = state.jitter ? '#000' : 'var(--accent)';
    });
    wrap.querySelector('[data-act="reset"]').addEventListener('click', () => {
      state.countNoOffset = 0;
      state.countWithOffset = 0;
    });
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
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
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
  window.VIZ_REGISTRY.deadzone = { mount, pause, resume };
})();
