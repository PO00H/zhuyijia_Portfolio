/**
 * CCD 连续碰撞检测可视化 v2
 * --------------------------------------------------------------
 * 还原 ECHOFLASH 真实 C++ 实现：
 *
 *   int   steps = (int)(dashDistance / CCD_STEP_SIZE) + 1;
 *   float stepX = (cos(angle) * dashDistance) / steps;
 *   float stepY = (sin(angle) * dashDistance) / steps;
 *   for (int i = 0; i < steps; i++) {
 *       position += {stepX, stepY};
 *       position = ResolveCollision(position, COLLISION_RAD, hitWall, true);
 *       if (hitWall) break;
 *   }
 *
 * 三个 slider 暴露给用户：
 *   DASH DISTANCE  — 突进距离 (DASH_BASE_DIST + chargePower)
 *   CCD_STEP_SIZE  — 灵魂参数：每步的微步长，越大越可能穿墙
 *   PLAYBACK SPEED — 仅影响演示速度，不是游戏真实帧率
 *
 * 状态：
 *   DASHING → REACHED   (走完未撞墙)
 *           → BLOCKED   (撞墙在 step N 被 break，触发 Stun)
 *           → PHASED    (step_size 太大跳过墙，CCD 失效)
 *
 * 接口：window.VIZ_REGISTRY.ccd = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // ── Canvas 尺寸 ──
  const W = 640, H = 220;

  // ── 来自真实 PlayerConfig 的常量 ──
  const COLLISION_RAD = 12;      // 玩家碰撞半径
  const PLAYER_SIZE = 24;        // 视觉方块大小

  // ── 场景布局 ──
  const START_X = 80;
  const PLAYER_Y = 100;
  const WALL_LEFT = 380;
  const WALL_RIGHT = 460;
  const WALL_TOP = 70, WALL_BOTTOM = 150;

  // ── Slider 默认值 ──
  const DEFAULT_DASH_DIST = 300;     // px
  const DEFAULT_STEP_SIZE = 30;      // px (DEFAULT_CCD_STEP_SIZE)
  const DEFAULT_INTERVAL = 200;      // ms / step

  // ── 颜色（与详情页设计变量一致）──
  const C_BG = '#1a1a1a';
  const C_GROUND = '#161616';
  const C_LINE = '#2a2a2a';
  const C_ACCENT = '#FF3D00';
  const C_GHOST = 'rgba(255,61,0,0.18)';
  const C_WALL = '#3a3a3a';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';
  const C_RED = '#FF5F57';
  const C_GREEN = '#28C840';
  const C_YELLOW = '#FEBC2E';

  // ──────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────
  function createState() {
    return {
      running: false,
      timer: 0,
      // 参数（可被 slider 修改）
      dashDist: DEFAULT_DASH_DIST,
      stepSize: DEFAULT_STEP_SIZE,
      stepInterval: DEFAULT_INTERVAL,
      // 运行中
      phase: 'IDLE',           // 'IDLE' | 'DASHING' | 'DONE'
      stepIdx: 0,
      steps: 0,
      stepDelta: 0,            // 每步位移
      x: START_X,
      history: [],             // 残影
      hitWall: false,
      phased: false,           // 穿墙了（step_size 太大）
      resultLabel: '',         // REACHED / BLOCKED / PHASED
      resultColor: C_GREEN,
    };
  }

  function aabbHit(x) {
    // 玩家方块的右沿越过墙左沿，且左沿未越过墙右沿
    return x + PLAYER_SIZE > WALL_LEFT && x < WALL_RIGHT;
  }

  function aabbPassedThrough(prevX, x) {
    // 检测"跳过"墙：上一步还在墙左侧，这一步已经在墙右侧
    return (prevX + PLAYER_SIZE) <= WALL_LEFT && x > WALL_RIGHT;
  }

  // ──────────────────────────────────────────────────────────
  // SIMULATION STEP (对应 C++ for 循环里的一次迭代)
  // ──────────────────────────────────────────────────────────
  function advanceStep(state) {
    const prevX = state.x;
    state.x += state.stepDelta;
    state.stepIdx++;

    // 模拟 ResolveCollision：检测 AABB 重叠
    if (aabbPassedThrough(prevX, state.x)) {
      // step_size 太大，CCD 失效 → 已经跳到墙后
      state.phased = true;
      // 视觉上让方块落在墙右侧（直观展示 bug）
      state.phase = 'DONE';
      state.resultLabel = 'PHASED · step too large, CCD failed';
      state.resultColor = C_RED;
      return;
    }
    if (aabbHit(state.x)) {
      // 撞墙 → 把方块退回到刚好贴着墙左沿（模拟 ResolveCollision）
      state.x = WALL_LEFT - PLAYER_SIZE;
      state.hitWall = true;
      state.phase = 'DONE';
      state.resultLabel = `BLOCKED at step ${state.stepIdx} · STUN`;
      state.resultColor = C_RED;
      return;
    }
    state.history.push({ x: prevX, idx: state.stepIdx });

    if (state.stepIdx >= state.steps) {
      state.phase = 'DONE';
      state.resultLabel = `REACHED · ${state.dashDist}px in ${state.steps} steps`;
      state.resultColor = C_GREEN;
    }
  }

  function startDash(state) {
    state.phase = 'DASHING';
    state.stepIdx = 0;
    // 与 C++ 公式完全对齐
    state.steps = Math.floor(state.dashDist / state.stepSize) + 1;
    state.stepDelta = state.dashDist / state.steps;
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
      const owner = state.container;
      advanceStep(state);
      draw(owner);
      if (state.phase === 'DASHING') {
        scheduleNext(state);
      } else {
        // DONE → 1.5s 后重置回 DASHING
        state.timer = setTimeout(() => {
          if (!state.running) return;
          startDash(state);
        }, 1500);
      }
    }, state.stepInterval);
  }

  // ──────────────────────────────────────────────────────────
  // DRAW
  // ──────────────────────────────────────────────────────────
  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    // ── 背景 ──
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 地板高亮带（玩家轨道）
    ctx.fillStyle = C_GROUND;
    ctx.fillRect(0, 60, W, 100);

    // ── 顶部信息条 ──
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_ACCENT;
    ctx.fillText('DASH ENGINE · CCD', 16, 14);
    // step 计数右上角
    const stepText = state.steps > 0
      ? `STEP  ${state.stepIdx} / ${state.steps}`
      : `STEP  — / —`;
    ctx.textAlign = 'right';
    ctx.fillStyle = state.phase === 'DASHING' ? C_FG : C_DIM;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(stepText, W - 16, 14);
    ctx.textAlign = 'left';

    // ── 墙 ──
    ctx.fillStyle = C_WALL;
    ctx.fillRect(WALL_LEFT, WALL_TOP, WALL_RIGHT - WALL_LEFT, WALL_BOTTOM - WALL_TOP);
    // 顶部橙色装饰条
    ctx.fillStyle = C_ACCENT;
    ctx.fillRect(WALL_LEFT, WALL_TOP, WALL_RIGHT - WALL_LEFT, 2);
    // 墙体标签
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    ctx.textAlign = 'center';
    ctx.fillText('WALL', (WALL_LEFT + WALL_RIGHT) / 2, WALL_BOTTOM + 6);
    ctx.textAlign = 'left';

    // ── 残影 ghost ──
    state.history.forEach((h) => {
      ctx.fillStyle = C_GHOST;
      ctx.fillRect(h.x, PLAYER_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    });

    // ── 玩家方块 ──
    ctx.fillStyle = state.hitWall ? C_RED : C_ACCENT;
    ctx.fillRect(state.x, PLAYER_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
    // 边缘高亮
    ctx.strokeStyle = state.hitWall ? '#ff8c84' : '#ffb380';
    ctx.lineWidth = 1;
    ctx.strokeRect(state.x + 0.5, PLAYER_Y - PLAYER_SIZE / 2 + 0.5, PLAYER_SIZE - 1, PLAYER_SIZE - 1);

    // 穿墙时把方块画在墙的右后侧，并加红色 ! 强调 bug
    if (state.phased) {
      const phasedX = WALL_RIGHT + 20;
      ctx.fillStyle = C_RED;
      ctx.fillRect(phasedX, PLAYER_Y - PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);
      ctx.fillStyle = C_BG;
      ctx.font = 'bold 16px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', phasedX + PLAYER_SIZE / 2, PLAYER_Y - 6);
      ctx.textAlign = 'left';
    }

    // ── 距离刻度尺 ──
    const RULER_Y = 180;
    ctx.strokeStyle = C_LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, RULER_Y);
    ctx.lineTo(W, RULER_Y);
    ctx.stroke();
    // 刻度
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    const ticks = [
      { x: START_X, label: 'START' },
      { x: WALL_LEFT, label: `${WALL_LEFT - START_X}px` },
      { x: WALL_RIGHT, label: '' },
      { x: START_X + state.dashDist, label: `${state.dashDist}px (target)` },
    ];
    ticks.forEach((t) => {
      if (t.x > W) return;
      ctx.beginPath();
      ctx.moveTo(t.x, RULER_Y - 4);
      ctx.lineTo(t.x, RULER_Y + 4);
      ctx.strokeStyle = C_DIM;
      ctx.stroke();
      if (t.label) {
        ctx.textAlign = 'center';
        ctx.fillStyle = t.label === 'START' ? C_ACCENT : C_DIM;
        ctx.fillText(t.label, t.x, RULER_Y + 8);
      }
    });
    ctx.textAlign = 'left';

    // ── 状态文字（底部）──
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    let statusText, statusColor;
    if (state.phase === 'DASHING') {
      statusText = `DASHING ▸ step ${state.stepIdx}/${state.steps} · pos ${Math.round(state.x - START_X)}px`;
      statusColor = C_YELLOW;
    } else if (state.phase === 'DONE') {
      statusText = state.resultLabel;
      statusColor = state.resultColor;
    } else {
      statusText = 'IDLE';
      statusColor = C_DIM;
    }
    ctx.fillStyle = statusColor;
    ctx.fillText(statusText, 16, H - 16);

    // 小提示（右下角）
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    ctx.textAlign = 'right';
    ctx.fillText('× slowed for clarity · in-game = 1 frame', W - 16, H - 14);
    ctx.textAlign = 'left';
  }

  // ──────────────────────────────────────────────────────────
  // MOUNT / PAUSE / RESUME
  // ──────────────────────────────────────────────────────────
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.className = 'viz-params';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="replay">▶ REPLAY</button>
      <div></div>
      <div class="viz-meta" style="text-align:right">
        <span style="color:#8a8a85">steps =</span>
        <span class="steps-val" style="color:#FF3D00;font-weight:bold">11</span>
      </div>

      <label>DASH DISTANCE</label>
      <input type="range" data-p="dashDist" min="100" max="500" step="10" value="${state.dashDist}" />
      <span class="val" data-v="dashDist">${state.dashDist}<small>px</small></span>

      <label>CCD_STEP_SIZE</label>
      <input type="range" data-p="stepSize" min="5" max="200" step="5" value="${state.stepSize}" />
      <span class="val" data-v="stepSize">${state.stepSize}<small>px</small></span>

      <label>PLAYBACK SPEED</label>
      <input type="range" data-p="stepInterval" min="40" max="500" step="20" value="${state.stepInterval}" />
      <span class="val" data-v="stepInterval">${state.stepInterval}<small>ms</small></span>
    `;
    container.appendChild(wrap);

    const updateStepsLabel = () => {
      const n = Math.floor(state.dashDist / state.stepSize) + 1;
      wrap.querySelector('.steps-val').textContent = n;
    };
    updateStepsLabel();

    wrap.querySelectorAll('input[type=range]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const key = inp.dataset.p;
        const val = parseInt(inp.value, 10);
        state[key] = val;
        const valEl = wrap.querySelector(`[data-v="${key}"]`);
        valEl.firstChild.nodeValue = val;
        updateStepsLabel();
      });
      // 触屏 stopPropagation 避免被外层吞掉
      inp.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    });

    wrap.querySelector('[data-act="replay"]').addEventListener('click', () => {
      clearTimeout(state.timer);
      startDash(state);
    });
  }

  function mount(container) {
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.cssText = 'display:block;width:100%;height:auto;border-radius:2px';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const state = createState();
    state.container = container;
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
    container._vizState = state;

    buildControls(container, state);

    state.running = true;
    draw(container);              // 先画初始静态画面
    startDash(state);             // 启动循环
  }

  function pause(container) {
    const state = container._vizState;
    if (!state) return;
    state.running = false;
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = 0;
    }
  }

  function resume(container) {
    const state = container._vizState;
    if (!state || state.running) return;
    state.running = true;
    startDash(state);
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.ccd = { mount, pause, resume };
})();
