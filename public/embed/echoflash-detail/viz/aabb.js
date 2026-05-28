/**
 * AABB 矢量排挤可视化
 * --------------------------------------------------------------
 * 1:1 还原 ECHOFLASH 源码 Map::ResolveCollision：
 *   1. 九宫格检测：仅扫描玩家圆形 AABB 覆盖的 tile，性能爆表
 *   2. 滤掉空 tile (type 0)；type 1 = 墙；type 2/3 = 竹子 (冲刺时穿)
 *   3. 最近点：clamp(playerPos, rectLeft..Right, rectTop..Bottom)
 *   4. dist² < radius² → 重叠：沿 (player - closest) 单位向量推开
 *      推开量 = radius - dist
 *
 * 交互：
 *   - 鼠标 / 触屏在地图内移动 → 圆形玩家平滑跟随
 *   - 撞墙时贴墙滑动，撞拐角时矢量平均推开
 *   - DASH 按钮切换冲刺模式 (竹子从绿变虚，可穿过)
 *   - 半径 slider 看不同尺寸玩家的碰撞表现
 *
 * 接口：window.VIZ_REGISTRY.aabb = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  // 来自 MapConfig：每格 32px (viz 中放大到 40 易看清)
  const TILE_SIZE = 40;
  const COLS = 16, ROWS = 10;
  const W = COLS * TILE_SIZE;       // 640
  const H = ROWS * TILE_SIZE;       // 400

  // 玩家配置（参考 PlayerConfig）
  const DEFAULT_RADIUS = 14;        // COLLISION_RAD
  const FOLLOW_SPEED = 0.22;        // 鼠标牵引平滑系数（同游戏鼠标牵引引擎）

  // 地图：'.' = 空, '#' = 实心墙(type 1), 'B' = 竹子(type 2)
  const MAP = [
    '................',
    '...####.........',
    '...#............',
    '...#.....####...',
    '.........#......',
    '....BBB..#......',
    '....BBB.........',
    '..........##....',
    '..........##....',
    '................',
  ];

  // 色板
  const C_BG = '#1a1a1a';
  const C_GRID = '#222';
  const C_WALL = '#3a3a3a';
  const C_WALL_TOP = '#FF3D00';
  const C_BAMBOO = '#6e6e6e';                // 灰色障碍 (原本是竹子绿)
  const C_BAMBOO_VEIN = '#4a4a4a';
  const C_BAMBOO_DASH = 'rgba(110,110,110,0.25)';
  const C_PLAYER = '#FF3D00';
  const C_PLAYER_RING = 'rgba(255,61,0,0.18)';
  const C_SCAN = 'rgba(254,188,46,0.15)';
  const C_SCAN_LINE = 'rgba(254,188,46,0.5)';
  const C_CLOSEST = '#FEBC2E';
  const C_PUSH = '#28C840';
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
      radius: DEFAULT_RADIUS,
      isDashing: false,
      target: { x: 80, y: 80 },     // 鼠标目标位置
      pos: { x: 80, y: 80 },        // 实际玩家位置
      hitCount: 0,
      scannedCells: [],
      hitInfos: [],                 // { r, c, type, closest, pushed }
    };
  }

  // ── 核心算法 ──
  function resolveCollision(state) {
    let nx = state.pos.x, ny = state.pos.y;
    const radius = state.radius;
    const isDashing = state.isDashing;
    let outHit = false;

    state.scannedCells = [];
    state.hitInfos = [];

    // 1. 九宫格范围
    const startC = Math.max(0, Math.floor((nx - radius) / TILE_SIZE));
    const endC   = Math.min(COLS - 1, Math.floor((nx + radius) / TILE_SIZE));
    const startR = Math.max(0, Math.floor((ny - radius) / TILE_SIZE));
    const endR   = Math.min(ROWS - 1, Math.floor((ny + radius) / TILE_SIZE));

    for (let r = startR; r <= endR; r++) {
      for (let c = startC; c <= endC; c++) {
        const type = getTile(r, c);
        state.scannedCells.push({ r, c, type });

        // 2. 滤掉不参与碰撞的 tile
        const willCollide =
          type === 1 ||
          ((type === 2 || type === 3) && !isDashing);
        if (!willCollide) continue;

        // 3. 最近点
        const rl = c * TILE_SIZE;
        const rr = rl + TILE_SIZE;
        const rt = r * TILE_SIZE;
        const rb = rt + TILE_SIZE;
        const closestX = Math.max(rl, Math.min(nx, rr));
        const closestY = Math.max(rt, Math.min(ny, rb));

        // 4. 距离平方判定
        const dx = nx - closestX;
        const dy = ny - closestY;
        const distSq = dx * dx + dy * dy;
        const info = { r, c, type, closest: { x: closestX, y: closestY }, push: null };
        if (distSq < radius * radius) {
          outHit = true;
          if (distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const overlap = radius - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;
            nx += pushX;
            ny += pushY;
            info.push = { x: pushX, y: pushY };
          }
          state.hitInfos.push(info);
        }
      }
    }

    state.pos.x = nx;
    state.pos.y = ny;
    state.hitCount = state.hitInfos.length;
    return outHit;
  }

  // ── 主循环：跟随鼠标 + 解析碰撞 + 绘制 ──
  function tick(container) {
    const state = container._vizState;
    if (!state.running) return;

    // 平滑跟随鼠标 (模拟游戏鼠标牵引引擎)
    state.pos.x += (state.target.x - state.pos.x) * FOLLOW_SPEED;
    state.pos.y += (state.target.y - state.pos.y) * FOLLOW_SPEED;
    // 应用碰撞解析
    resolveCollision(state);

    draw(container);
    state.raf = requestAnimationFrame(() => tick(container));
  }

  // ── DRAW ──
  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);

    // 背景
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 网格线
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

    // 绘制地图块
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = getTile(r, c);
        if (t === 0) continue;
        const x = c * TILE_SIZE, y = r * TILE_SIZE;
        if (t === 1) {
          ctx.fillStyle = C_WALL;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          // 顶部装饰条
          ctx.fillStyle = C_WALL_TOP;
          ctx.fillRect(x, y, TILE_SIZE, 2);
        } else if (t === 2) {
          ctx.fillStyle = state.isDashing ? C_BAMBOO_DASH : C_BAMBOO;
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          // 竖纹（区分实心墙）
          ctx.strokeStyle = C_BAMBOO_VEIN;
          ctx.lineWidth = 1;
          [0.3, 0.6].forEach((f) => {
            ctx.beginPath();
            ctx.moveTo(x + TILE_SIZE * f, y + 2);
            ctx.lineTo(x + TILE_SIZE * f, y + TILE_SIZE - 2);
            ctx.stroke();
          });
        }
      }
    }

    // 九宫格扫描范围高亮 (半透明黄)
    state.scannedCells.forEach((cell) => {
      ctx.fillStyle = C_SCAN;
      ctx.fillRect(cell.c * TILE_SIZE, cell.r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = C_SCAN_LINE;
      ctx.lineWidth = 1;
      ctx.strokeRect(cell.c * TILE_SIZE + 0.5, cell.r * TILE_SIZE + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
    });

    // 玩家碰撞半径范围（半透明圆）
    ctx.fillStyle = C_PLAYER_RING;
    ctx.beginPath();
    ctx.arc(state.pos.x, state.pos.y, state.radius, 0, Math.PI * 2);
    ctx.fill();

    // 最近点 + 推开向量
    state.hitInfos.forEach((info) => {
      // 最近点（黄色小圆 + 外圈）
      ctx.fillStyle = C_CLOSEST;
      ctx.beginPath();
      ctx.arc(info.closest.x, info.closest.y, 3, 0, Math.PI * 2);
      ctx.fill();
      // closest → player 的线 (推开方向)
      ctx.strokeStyle = C_PUSH;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(info.closest.x, info.closest.y);
      ctx.lineTo(state.pos.x, state.pos.y);
      ctx.stroke();
      // 箭头头
      if (info.push) {
        const len = Math.hypot(info.push.x, info.push.y);
        if (len > 0.5) {
          const ax = info.push.x / len, ay = info.push.y / len;
          const tipX = state.pos.x;
          const tipY = state.pos.y;
          ctx.fillStyle = C_PUSH;
          ctx.beginPath();
          ctx.moveTo(tipX, tipY);
          ctx.lineTo(tipX - ax * 6 + ay * 4, tipY - ay * 6 - ax * 4);
          ctx.lineTo(tipX - ax * 6 - ay * 4, tipY - ay * 6 + ax * 4);
          ctx.closePath();
          ctx.fill();
        }
      }
    });

    // 玩家本体（橙色实心圆）
    ctx.fillStyle = state.hitCount > 0 ? '#FF5F57' : C_PLAYER;
    ctx.beginPath();
    ctx.arc(state.pos.x, state.pos.y, state.radius - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffb380';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(state.pos.x, state.pos.y, state.radius - 2, 0, Math.PI * 2);
    ctx.stroke();

    // 目标点（鼠标位置标记，玩家被卡住时清晰看到 target 在哪）
    if (Math.hypot(state.target.x - state.pos.x, state.target.y - state.pos.y) > 2) {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(state.target.x, state.target.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 顶部信息
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_WALL_TOP;
    ctx.fillText('AABB · 矩形最近点 + 矢量排挤', 12, 10);
    ctx.textAlign = 'right';
    ctx.fillStyle = state.hitCount > 0 ? '#FF5F57' : C_DIM;
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(`SCANNED ${state.scannedCells.length}  ·  HIT ${state.hitCount}`, W - 12, 10);
    ctx.textAlign = 'left';

    // 底部图例
    const legendY = H - 14;
    ctx.font = '9px "JetBrains Mono", monospace';
    let lx = 12;
    function legendItem(color, label) {
      ctx.fillStyle = color;
      ctx.fillRect(lx, legendY + 2, 8, 8);
      ctx.fillStyle = C_DIM;
      ctx.fillText(label, lx + 12, legendY + 1);
      lx += 12 + ctx.measureText(label).width + 16;
    }
    legendItem(C_SCAN_LINE, 'scanned cell');
    legendItem(C_CLOSEST, 'closest pt');
    legendItem(C_PUSH, 'push vector');

    // 模式提示（右下）
    ctx.textAlign = 'right';
    ctx.fillStyle = state.isDashing ? '#FEBC2E' : C_DIM;
    ctx.fillText(state.isDashing ? 'DASH MODE · bamboo passable' : 'WALK MODE', W - 12, legendY + 1);
    ctx.textAlign = 'left';
  }

  // ── CONTROLS ──
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.className = 'viz-controls-row';
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="dash">▶ DASH MODE</button>
      <div style="display:flex;align-items:center;gap:.5rem;flex:1;min-width:240px">
        <label style="color:var(--fg-dim);letter-spacing:.05em">RADIUS</label>
        <input type="range" min="6" max="28" step="1" value="${state.radius}" style="accent-color:var(--accent);flex:1" />
        <span class="r-val" style="color:var(--fg);min-width:36px;text-align:right">${state.radius}<small style="color:var(--fg-mute)">px</small></span>
      </div>
      <div style="color:var(--fg-dim)">
        <span style="color:var(--fg-dim)">hint:</span>
        <span style="color:var(--fg)">move cursor over map</span>
      </div>
    `;
    container.appendChild(wrap);

    const slider = wrap.querySelector('input[type=range]');
    const valLabel = wrap.querySelector('.r-val');
    slider.addEventListener('input', () => {
      state.radius = parseInt(slider.value, 10);
      valLabel.firstChild.nodeValue = slider.value;
    });
    slider.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

    const dashBtn = wrap.querySelector('[data-act="dash"]');
    dashBtn.addEventListener('click', () => {
      state.isDashing = !state.isDashing;
      dashBtn.textContent = state.isDashing ? '◼ STOP DASH' : '▶ DASH MODE';
      dashBtn.style.background = state.isDashing ? 'var(--accent)' : 'transparent';
      dashBtn.style.color = state.isDashing ? '#000' : 'var(--accent)';
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
      state.target.x = (clientX - rect.left) * sx;
      state.target.y = (clientY - rect.top) * sx;
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
    tick(container);
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
    tick(container);
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.aabb = { mount, pause, resume };
})();
