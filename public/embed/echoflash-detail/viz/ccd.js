/**
 * CCD 连续碰撞检测可视化 v3
 * --------------------------------------------------------------
 * 还原 ECHOFLASH 真实 C++ 实现:
 *   int   steps   = (int)(dashDistance / CCD_STEP_SIZE) + 1;
 *   float stepX   = (cos(angle) * dashDistance) / steps;
 *   for (int i = 0; i < steps; i++) {
 *       position += {stepX, stepY};
 *       position = ResolveCollision(position, COLLISION_RAD, hitWall, true);
 *       if (hitWall) break;
 *   }
 *
 * UI 简化为 1 个 slider 控制 CCD_STEP_SIZE + 3 个预设：
 *   PRECISE  (step=10)   多步细切，精确停在墙前
 *   FAST     (step=30)   合理的默认值
 *   TELEPORT (step=200)  步长过大，跳过墙 -> CCD 失效 (PHASED!)
 *
 * 接口：window.VIZ_REGISTRY.ccd = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // ── 逻辑坐标（CSS 像素），实际 canvas 内部分辨率 × DPR ──
  const W = 640, H = 200;
  const PLAYER_SIZE = 24;
  const START_X = 80;
  const PLAYER_Y = 100;
  const WALL_LEFT = 380;
  const WALL_RIGHT = 460;
  const WALL_TOP = 70, WALL_BOTTOM = 150;

  const DASH_DIST = 320;          // 固定突进距离
  const PLAY_INTERVAL = 140;      // ms / step (固定演示节奏)
  const HOLD_AFTER_DONE = 1400;   // ms 完成后停留

  const PRESETS = [
    { name: 'PRECISE',  step: 10  },
    { name: 'FAST',     step: 30  },
    { name: 'TELEPORT', step: 200 },
  ];
  const DEFAULT_STEP = 30;

  // 色板（与详情页 CSS var 一致）
  const C_BG = '#1a1a1a';
  const C_GROUND = '#161616';
  const C_LINE = '#2a2a2a';
  const C_ACCENT = '#FF3D00';
  const C_GHOST = 'rgba(255,61,0,0.22)';
  const C_WALL = '#3a3a3a';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';
  const C_RED = '#FF5F57';
  const C_GREEN = '#28C840';
  const C_YELLOW = '#FEBC2E';

  // ──────────────────────────────────────────────────────────
  function createState() {
    return {
      running: false,
      timer: 0,
      stepSize: DEFAULT_STEP,
      phase: 'IDLE',
      stepIdx: 0,
      steps: 0,
      stepDelta: 0,
      x: START_X,
      history: [],
      hitWall: false,
      phased: false,
      resultLabel: '',
      resultColor: C_GREEN,
    };
  }

  function advanceStep(state) {
    const prevX = state.x;
    const nextX = state.x + state.stepDelta;
    state.stepIdx++;

    const wasOutside = prevX + PLAYER_SIZE <= WALL_LEFT;
    const willPass = nextX >= WALL_RIGHT;
    const willHit = (nextX + PLAYER_SIZE > WALL_LEFT) && (nextX < WALL_RIGHT);

    // PHASED：上一帧还在墙左外，这一帧已经过墙右 → step 跨度太大跳过墙
    if (wasOutside && willPass) {
      state.history.push({ x: prevX });
      state.x = nextX;
      state.phased = true;
      state.phase = 'DONE';
      state.resultLabel = 'PHASED · CCD failed (step > wall)';
      state.resultColor = C_RED;
      return;
    }

    // BLOCKED：常规撞墙，模拟 ResolveCollision 把方块推回墙前
    if (willHit) {
      state.history.push({ x: prevX });
      state.x = WALL_LEFT - PLAYER_SIZE;
      state.hitWall = true;
      state.phase = 'DONE';
      state.resultLabel = `BLOCKED at step ${state.stepIdx} · STUN`;
      state.resultColor = C_RED;
      return;
    }

    // 正常推进
    state.history.push({ x: prevX });
    state.x = nextX;

    if (state.stepIdx >= state.steps) {
      state.phase = 'DONE';
      state.resultLabel = `REACHED · ${DASH_DIST}px in ${state.steps} steps`;
      state.resultColor = C_GREEN;
    }
  }

  function startDash(state) {
    state.phase = 'DASHING';
    state.stepIdx = 0;
    state.steps = Math.floor(DASH_DIST / state.stepSize) + 1;
    state.stepDelta = DASH_DIST / state.steps;
    state.x = START_X;
    state.history = [];
    state.hitWall = false;
    state.phased = false;
    state.resultLabel = '';
    scheduleNext(state);
  }

  function scheduleNext(state) {
    state.timer = setTimeout(() => {
      if (!state.running) return;
      advanceStep(state);
      draw(state.container);
      if (state.phase === 'DASHING') {
        scheduleNext(state);
      } else {
        // DONE 状态保持一段时间再重置
        state.timer = setTimeout(() => {
          if (!state.running) return;
          startDash(state);
        }, HOLD_AFTER_DONE);
      }
    }, PLAY_INTERVAL);
  }

  // ──────────────────────────────────────────────────────────
  // DRAW
  // ──────────────────────────────────────────────────────────
  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);

    // 背景
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);
    // 轨道带
    ctx.fillStyle = C_GROUND;
    ctx.fillRect(0, 55, W, 100);

    // 顶部信息
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_ACCENT;
    ctx.fillText('DASH ENGINE · CCD', 16, 12);
    ctx.textAlign = 'right';
    ctx.fillStyle = state.phase === 'DASHING' ? C_FG : C_DIM;
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(`STEP  ${state.stepIdx} / ${state.steps}`, W - 16, 12);
    ctx.textAlign = 'left';

    // 墙
    ctx.fillStyle = C_WALL;
    ctx.fillRect(WALL_LEFT, WALL_TOP, WALL_RIGHT - WALL_LEFT, WALL_BOTTOM - WALL_TOP);
    ctx.fillStyle = C_ACCENT;
    ctx.fillRect(WALL_LEFT, WALL_TOP, WALL_RIGHT - WALL_LEFT, 2);
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    ctx.textAlign = 'center';
    ctx.fillText('WALL', (WALL_LEFT + WALL_RIGHT) / 2, WALL_BOTTOM + 5);
    ctx.textAlign = 'left';

    // 残影
    state.history.forEach((h) => {
      ctx.fillStyle = C_GHOST;
      ctx.fillRect(h.x, PLAYER_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    });

    // 玩家
    ctx.fillStyle = state.hitWall ? C_RED : (state.phased ? C_RED : C_ACCENT);
    ctx.fillRect(state.x, PLAYER_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    ctx.strokeStyle = state.hitWall || state.phased ? '#ff8c84' : '#ffb380';
    ctx.lineWidth = 1;
    ctx.strokeRect(state.x + 0.5, PLAYER_Y - PLAYER_SIZE / 2 + 0.5, PLAYER_SIZE - 1, PLAYER_SIZE - 1);

    if (state.phased) {
      // 在玩家上方加红色感叹号
      ctx.fillStyle = C_RED;
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', state.x + PLAYER_SIZE / 2, PLAYER_Y - 26);
      ctx.textAlign = 'left';
    }

    // 刻度尺
    const RY = 172;
    ctx.strokeStyle = C_LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, RY);
    ctx.lineTo(W, RY);
    ctx.stroke();
    ctx.font = '9px "JetBrains Mono", monospace';
    const ticks = [
      { x: START_X, label: 'START', col: C_ACCENT },
      { x: WALL_LEFT, label: '↓ wall', col: C_DIM },
      { x: START_X + DASH_DIST, label: `target ${DASH_DIST}px`, col: C_DIM },
    ];
    ticks.forEach((t) => {
      if (t.x > W) return;
      ctx.strokeStyle = t.col;
      ctx.beginPath();
      ctx.moveTo(t.x, RY - 4);
      ctx.lineTo(t.x, RY + 4);
      ctx.stroke();
      ctx.fillStyle = t.col;
      ctx.textAlign = 'center';
      ctx.fillText(t.label, t.x, RY + 8);
    });
    ctx.textAlign = 'left';

    // 底部状态
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    let st, sc;
    if (state.phase === 'DASHING') {
      st = `DASHING ▸ step ${state.stepIdx}/${state.steps} · pos ${Math.round(state.x - START_X)}px`;
      sc = C_YELLOW;
    } else if (state.phase === 'DONE') {
      st = state.resultLabel;
      sc = state.resultColor;
    } else {
      st = 'IDLE';
      sc = C_DIM;
    }
    ctx.fillStyle = sc;
    ctx.fillText(st, 16, H - 14);
  }

  // ──────────────────────────────────────────────────────────
  // CONTROLS
  // ──────────────────────────────────────────────────────────
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.className = 'viz-controls-row';
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="replay">▶ REPLAY</button>
      <div style="display:flex;gap:.4rem">
        ${PRESETS.map((p, i) => `<button class="viz-btn viz-preset" data-step="${p.step}">${p.name}</button>`).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;flex:1;min-width:240px">
        <label style="color:var(--fg-dim);letter-spacing:.05em">STEP SIZE</label>
        <input type="range" min="5" max="240" step="5" value="${state.stepSize}" style="accent-color:var(--accent);flex:1" />
        <span class="step-val" style="color:var(--fg);min-width:48px;text-align:right">${state.stepSize}<small style="color:var(--fg-mute)">px</small></span>
      </div>
      <div style="color:var(--fg-dim)">
        steps = <span class="steps-val" style="color:var(--accent);font-weight:700">11</span>
      </div>
    `;
    container.appendChild(wrap);

    const slider = wrap.querySelector('input[type=range]');
    const stepValLabel = wrap.querySelector('.step-val');
    const stepsLabel = wrap.querySelector('.steps-val');

    function updateStepsLabel() {
      stepsLabel.textContent = Math.floor(DASH_DIST / state.stepSize) + 1;
    }
    function applyStep(step) {
      state.stepSize = step;
      slider.value = step;
      stepValLabel.firstChild.nodeValue = step;
      updateStepsLabel();
    }
    updateStepsLabel();

    slider.addEventListener('input', () => applyStep(parseInt(slider.value, 10)));
    slider.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

    wrap.querySelectorAll('.viz-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyStep(parseInt(btn.dataset.step, 10));
        clearTimeout(state.timer);
        startDash(state);
      });
    });

    wrap.querySelector('[data-act="replay"]').addEventListener('click', () => {
      clearTimeout(state.timer);
      startDash(state);
    });
  }

  // ──────────────────────────────────────────────────────────
  // MOUNT
  // ──────────────────────────────────────────────────────────
  function mount(container) {
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    // DPR 高清渲染：内部分辨率 = CSS × DPR
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.cssText = `display:block;width:100%;height:auto;max-width:${W}px;margin:0 auto;border-radius:2px;image-rendering:auto`;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    // 让所有绘制操作仍然按 CSS 坐标系（W × H）写
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const state = createState();
    state.container = container;
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
    container._vizState = state;

    buildControls(container, state);

    state.running = true;
    draw(container);
    startDash(state);
  }

  function pause(container) {
    const s = container._vizState;
    if (!s) return;
    s.running = false;
    if (s.timer) { clearTimeout(s.timer); s.timer = 0; }
  }

  function resume(container) {
    const s = container._vizState;
    if (!s || s.running) return;
    s.running = true;
    startDash(s);
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.ccd = { mount, pause, resume };
})();
