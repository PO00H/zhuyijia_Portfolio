/**
 * Raymarching 场景破坏可视化
 * --------------------------------------------------------------
 * 1:1 还原 ECHOFLASH 源码 Map::SlashBamboo：
 *
 *   1. dx, dy = slashEnd - slashStart
 *   2. distance = sqrt(dx² + dy²)
 *   3. dirX = dx/distance, dirY = dy/distance    // 单位方向向量
 *   4. step = TILE_SIZE / 2                       // 步长，半格保证不漏检
 *   5. for currentDist in [0, distance] step step:
 *        sampleX = slashStart.x + dirX * currentDist
 *        sampleY = slashStart.y + dirY * currentDist
 *        c = sampleX / TILE_SIZE   (锁定列)
 *        r = sampleY / TILE_SIZE   (锁定行)
 *        if grid[r][c] is bamboo:
 *            destroy it (type -> 0, set memoryTimer)
 *
 * 演示循环 (5.5s 一轮):
 *   IDLE     ↓ 0.6s  鼠标控制斩击方向 (预览线)
 *   SLASHING ↓ 1.5s  采样点沿线段逐个亮起 + 命中竹子立即破坏
 *   HOLD     ↓ 2.5s  保持斩击效果，看破坏结果
 *   FADE     ↓ 0.9s  竹子重生 (淡入)
 *
 * 交互：
 *   - 鼠标 / 触屏 在 canvas 内移动 → 控制斩击终点 (只在 IDLE 阶段生效)
 *   - STEP slider → 调采样步长，看 raymarch 精度 trade-off
 *   - REPLAY 立即重置循环
 *
 * 接口：window.VIZ_REGISTRY.raymarch = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // 地图: '.' = 空, 'B' = 竹子(type 2), '#' = 实心墙(type 1, raymarch 不破坏)
  // 故意让两片竹林在玩家右前方，留出狭缝/夹角让 step size 差异可见
  const MAP = [
    '................',
    '...BB.....BBB...',
    '...BBB...BBBB...',
    '..PBBBB..BBBBB..',
    '...BBB...BBBB...',
    '...BB.....BBB...',
    '................',
    '................',
  ];

  const TILE_SIZE = 40;
  const COLS = MAP[0].length;       // 16
  const ROWS = MAP.length;          // 8
  const W = COLS * TILE_SIZE;       // 640
  const H = ROWS * TILE_SIZE;       // 320

  // 玩家固定起点（从地图 P 标记自动定位）
  let PLAYER_C = 2, PLAYER_R = 3;
  for (let r = 0; r < ROWS; r++) {
    const c = MAP[r].indexOf('P');
    if (c >= 0) { PLAYER_C = c; PLAYER_R = r; }
  }
  const PLAYER_X = PLAYER_C * TILE_SIZE + TILE_SIZE / 2;
  const PLAYER_Y = PLAYER_R * TILE_SIZE + TILE_SIZE / 2;

  const DEFAULT_STEP = TILE_SIZE / 2;   // 真实游戏的 step 值

  // 阶段时长 (ms)
  const T_IDLE = 600;
  const T_SLASH = 1500;
  const T_HOLD = 2500;
  const T_FADE = 900;
  const TOTAL = T_IDLE + T_SLASH + T_HOLD + T_FADE;

  // 色板
  const C_BG = '#1a1a1a';
  const C_GRID = '#222';
  const C_WALL = '#3a3a3a';
  const C_BAMBOO = '#5a8c3a';
  const C_BAMBOO_VEIN = '#4a7c2a';
  const C_PLAYER = '#FF3D00';
  const C_PREVIEW = 'rgba(255,255,255,0.35)';
  const C_SLASH = '#FF3D00';
  const C_SAMPLE = '#FEBC2E';
  const C_HIT_TILE = 'rgba(255,61,0,0.32)';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';

  function getTile(r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return 0;
    const ch = MAP[r][c];
    if (ch === '#') return 1;
    if (ch === 'B') return 2;
    return 0;
  }

  function createState() {
    return {
      running: false,
      raf: 0,
      startTs: 0,
      step: DEFAULT_STEP,
      target: { x: 14 * TILE_SIZE, y: PLAYER_Y },
      // 锁定的本轮斩击终点（SLASHING 阶段不再跟随鼠标）
      slashEnd: { x: 14 * TILE_SIZE, y: PLAYER_Y },
      // 本轮所有采样点 (在 IDLE → SLASHING 转换时一次性算好)
      samples: [],
      sampleProgress: 0,    // 0~1：当前已展示到第几个采样点
      destroyed: new Set(), // 'r,c' 字符串
      destroyedT: new Map(),// 'r,c' -> 破坏的时间 (用于淡出动画)
      phase: 'IDLE',
    };
  }

  // ── 算法 (源码翻译)：沿线段步进采样 ──
  function buildSamples(state) {
    const dx = state.slashEnd.x - PLAYER_X;
    const dy = state.slashEnd.y - PLAYER_Y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    state.samples = [];
    if (distance <= 0.001) return;
    const dirX = dx / distance;
    const dirY = dy / distance;
    const step = state.step;
    for (let d = 0; d <= distance; d += step) {
      const sx = PLAYER_X + dirX * d;
      const sy = PLAYER_Y + dirY * d;
      const c = Math.floor(sx / TILE_SIZE);
      const r = Math.floor(sy / TILE_SIZE);
      state.samples.push({ sx, sy, r, c, d });
    }
    // 确保末端被采到（防止距离不是 step 的整数倍漏掉终点）
    state.samples.push({
      sx: state.slashEnd.x, sy: state.slashEnd.y,
      c: Math.floor(state.slashEnd.x / TILE_SIZE),
      r: Math.floor(state.slashEnd.y / TILE_SIZE),
      d: distance,
    });
  }

  function startSlash(state) {
    state.slashEnd = { x: state.target.x, y: state.target.y };
    buildSamples(state);
    state.destroyed = new Set();
    state.destroyedT = new Map();
  }

  function processSamplesUpTo(state, sampleIdx) {
    // 重放：从头依次 destroy（保证每帧画面与采样进度一致）
    state.destroyed = new Set();
    for (let i = 0; i <= sampleIdx && i < state.samples.length; i++) {
      const s = state.samples[i];
      if (s.r < 0 || s.r >= ROWS || s.c < 0 || s.c >= COLS) continue;
      if (getTile(s.r, s.c) === 2) {
        const key = `${s.r},${s.c}`;
        if (!state.destroyed.has(key)) {
          state.destroyed.add(key);
          state.destroyedT.set(key, performance.now());
        }
      }
    }
  }

  // ── 主循环 ──
  function loop(container, ts) {
    const state = container._vizState;
    if (!state.running) return;
    if (!state.startTs) state.startTs = ts;
    const elapsed = (ts - state.startTs) % TOTAL;

    // 阶段判定
    if (elapsed < T_IDLE) {
      state.phase = 'IDLE';
      // IDLE 阶段持续追踪鼠标
    } else if (elapsed < T_IDLE + T_SLASH) {
      if (state.phase === 'IDLE') {
        // 切换到 SLASHING：锁定 slashEnd，算所有采样点
        startSlash(state);
      }
      state.phase = 'SLASHING';
      const t = (elapsed - T_IDLE) / T_SLASH;
      const idx = Math.floor(t * (state.samples.length - 1));
      state.sampleProgress = idx;
      processSamplesUpTo(state, idx);
    } else if (elapsed < T_IDLE + T_SLASH + T_HOLD) {
      state.phase = 'HOLD';
    } else {
      state.phase = 'FADE';
      // FADE 阶段，让被破坏的竹子逐渐"复原"
      // (实现方式：在 draw 阶段，按 destroyedT 计算 alpha)
    }

    // 一个 cycle 结束
    if (elapsed < 50) {
      // 进入新一轮 IDLE 时清空状态
      state.destroyed = new Set();
      state.destroyedT = new Map();
      state.samples = [];
      state.sampleProgress = 0;
    }

    draw(container, elapsed);
    state.raf = requestAnimationFrame((t) => loop(container, t));
  }

  // ── DRAW ──
  function draw(container, elapsed) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    // 背景
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 网格
    ctx.strokeStyle = C_GRID;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TILE_SIZE, 0);
      ctx.lineTo(i * TILE_SIZE, H);
      ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * TILE_SIZE);
      ctx.lineTo(W, j * TILE_SIZE);
      ctx.stroke();
    }

    // 当前帧的"在 FADE 阶段中淡入"的进度
    const fadeStart = T_IDLE + T_SLASH + T_HOLD;
    const inFade = elapsed >= fadeStart;
    const fadeT = inFade ? Math.min(1, (elapsed - fadeStart) / T_FADE) : 0;

    // 地图块
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = getTile(r, c);
        if (t === 0) continue;
        const x = c * TILE_SIZE, y = r * TILE_SIZE;
        const key = `${r},${c}`;
        const isDestroyed = state.destroyed.has(key);

        if (t === 1) {
          ctx.fillStyle = C_WALL;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = C_PLAYER;
          ctx.fillRect(x, y, TILE_SIZE, 2);
        } else if (t === 2) {
          let alpha = 1;
          if (isDestroyed) {
            // 在 HOLD 阶段完全消失，FADE 阶段重生
            alpha = inFade ? fadeT : 0;
          }
          if (alpha > 0) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = C_BAMBOO;
            ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            ctx.strokeStyle = C_BAMBOO_VEIN;
            ctx.lineWidth = 1;
            [0.3, 0.6].forEach((f) => {
              ctx.beginPath();
              ctx.moveTo(x + TILE_SIZE * f, y + 4);
              ctx.lineTo(x + TILE_SIZE * f, y + TILE_SIZE - 4);
              ctx.stroke();
            });
            ctx.globalAlpha = 1;
          } else {
            // 完全破坏时画一个"残骸"标记 (深绿小点)
            ctx.fillStyle = 'rgba(90,140,58,0.15)';
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 命中 tile 高亮 (橙色蒙版，所有被破坏的 tile)
    state.destroyed.forEach((key) => {
      if (inFade) return; // FADE 阶段不再画高亮
      const [r, c] = key.split(',').map(Number);
      ctx.fillStyle = C_HIT_TILE;
      ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // 斩击线段
    const slashEndPos = (state.phase === 'IDLE' || state.phase === 'FADE')
      ? state.target
      : state.slashEnd;
    drawLine(ctx, PLAYER_X, PLAYER_Y, slashEndPos.x, slashEndPos.y,
      state.phase === 'IDLE' || state.phase === 'FADE' ? C_PREVIEW : C_SLASH,
      state.phase === 'IDLE' || state.phase === 'FADE' ? [4, 4] : []);

    // 采样点 (只在 SLASHING / HOLD 阶段显示)
    if (state.phase === 'SLASHING' || state.phase === 'HOLD') {
      state.samples.forEach((s, i) => {
        const shown = state.phase === 'HOLD' || i <= state.sampleProgress;
        if (!shown) return;
        ctx.fillStyle = C_SAMPLE;
        ctx.beginPath();
        ctx.arc(s.sx, s.sy, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 玩家
    ctx.fillStyle = C_PLAYER;
    ctx.beginPath();
    ctx.arc(PLAYER_X, PLAYER_Y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffb380';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(PLAYER_X, PLAYER_Y, 9, 0, Math.PI * 2);
    ctx.stroke();

    // 终点指示
    if (state.phase === 'IDLE') {
      ctx.strokeStyle = C_PREVIEW;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(state.target.x, state.target.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 顶部信息
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_PLAYER;
    ctx.fillText('RAYMARCH · SlashBamboo()', 12, 10);

    const distance = Math.hypot(slashEndPos.x - PLAYER_X, slashEndPos.y - PLAYER_Y);
    const totalSamples = state.samples.length;
    ctx.textAlign = 'right';
    ctx.fillStyle = C_DIM;
    ctx.fillText(
      `dist ${distance.toFixed(0)}px · step ${state.step}px · samples ${totalSamples}`,
      W - 12, 10
    );
    ctx.textAlign = 'left';

    // 底部状态条
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    let st = '', sc = C_DIM;
    if (state.phase === 'IDLE') { st = 'IDLE · move cursor to aim'; sc = C_DIM; }
    else if (state.phase === 'SLASHING') {
      const destroyed = state.destroyed.size;
      st = `SLASHING ▸ sample ${state.sampleProgress + 1}/${state.samples.length} · destroyed ${destroyed}`;
      sc = C_SAMPLE;
    }
    else if (state.phase === 'HOLD') {
      st = `HIT ${state.destroyed.size} bamboo cell${state.destroyed.size === 1 ? '' : 's'} along ray`;
      sc = C_PLAYER;
    }
    else if (state.phase === 'FADE') {
      st = `regrowing ${Math.round(fadeT * 100)}%`;
      sc = C_BAMBOO;
    }
    ctx.fillStyle = sc;
    ctx.fillText(st, 12, H - 16);

    // 图例 (右下)
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    ctx.textAlign = 'right';
    ctx.fillText('• sample pt   ■ destroyed   — slash ray', W - 12, H - 14);
    ctx.textAlign = 'left';
  }

  function drawLine(ctx, x1, y1, x2, y2, color, dashArr) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    if (dashArr && dashArr.length) ctx.setLineDash(dashArr);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── CONTROLS ──
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.className = 'viz-controls-row';
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="replay">▶ REPLAY</button>
      <div style="display:flex;align-items:center;gap:.5rem;flex:1;min-width:240px">
        <label style="color:var(--fg-dim);letter-spacing:.05em">STEP SIZE</label>
        <input type="range" min="8" max="80" step="2" value="${state.step}" style="accent-color:var(--accent);flex:1" />
        <span class="step-val" style="color:var(--fg);min-width:42px;text-align:right">${state.step}<small style="color:var(--fg-mute)">px</small></span>
      </div>
      <div style="color:var(--fg-dim)">
        <span style="color:var(--fg-dim)">hint:</span>
        <span style="color:var(--fg)">larger step → bamboo can slip through gaps</span>
      </div>
    `;
    container.appendChild(wrap);

    const slider = wrap.querySelector('input[type=range]');
    const valLabel = wrap.querySelector('.step-val');
    slider.addEventListener('input', () => {
      state.step = parseInt(slider.value, 10);
      valLabel.firstChild.nodeValue = slider.value;
    });
    slider.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

    wrap.querySelector('[data-act="replay"]').addEventListener('click', () => {
      state.startTs = 0;       // 重置时间，下一帧从 IDLE 重新开始
      state.destroyed = new Set();
      state.samples = [];
    });
  }

  // ── MOUNT ──
  function mount(container) {
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.cssText = `display:block;width:100%;height:auto;max-width:${W}px;margin:0 auto;border-radius:2px;touch-action:none`;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    const state = createState();
    state.container = container;
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
    container._vizState = state;

    buildControls(container, state);

    // 鼠标 / 触屏跟踪
    const updateTarget = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width;
      state.target.x = Math.max(0, Math.min(W, (clientX - rect.left) * sx));
      state.target.y = Math.max(0, Math.min(H, (clientY - rect.top) * sx));
    };
    canvas.addEventListener('mousemove', (e) => updateTarget(e.clientX, e.clientY));
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches[0]) {
        updateTarget(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches[0]) updateTarget(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    state.running = true;
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
    s.startTs = 0;
    s.raf = requestAnimationFrame((ts) => loop(container, ts));
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.raymarch = { mount, pause, resume };
})();
