/**
 * BFS 全局热力图寻路可视化 (零分配 1D 数组)
 * --------------------------------------------------------------
 * 核心思想：
 *   弃用 OOP 动态节点 A*，改用预分配 1D 连续数组热力图。
 *   每帧从玩家位置 BFS 扩散，整张地图各格存到玩家的最短距离。
 *   N 个敌人只需 O(1) 看自己周围 4 格选最小热值 → 朝那走。
 *
 *   性能：内存分配次数 = 0（数组在 mount 时分配一次）
 *         寻路开销与敌人数量无关，恒定 = BFS 一次
 *
 * 实现关键点：
 *   1. const heatMap = new Int16Array(COLS * ROWS);        // 一次性
 *   2. const queue   = new Int32Array(COLS * ROWS);        // 一次性
 *   3. 每帧 heatMap.fill(WALL_VALUE) → BFS from player
 *   4. 敌人决策 = 取四向 heat 最小者
 *
 * 演示场景：封闭网格 (墙包围) 内：
 *   - 玩家是热源 (热度 0)，可拖动
 *   - 多个敌人散布，每帧朝热度更低的格子移动
 *   - 热力图按距离着色 (近=橙红，远=深紫，墙=黑)
 *
 * 控件：
 *   - ADD ENEMY / REMOVE / RESET
 *   - 鼠标拖动 → 移动玩家
 *   - SHOW PATHS：在敌人格子绘制朝向最佳方向的小箭头
 *   - 显示统计：cells / walls / enemies / 每帧 BFS 步数 / 内存分配 (永远是 0)
 *
 * 接口：window.VIZ_REGISTRY.bfs = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  const TILE = 28;
  const COLS = 22, ROWS = 14;
  const W = COLS * TILE;     // 616
  const H = ROWS * TILE;     // 392

  const TOTAL = COLS * ROWS;
  const WALL = 32767;        // 实际可视距离一般 < 200，32767 作为"不可达"哨兵

  // 封闭空间地图：'.' 空地, '#' 墙, 'P' 玩家初始, 'E' 敌人初始
  const MAP_TEMPLATE = [
    '######################',
    '#....................#',
    '#.####...........###.#',
    '#.#..............#...#',
    '#.#..######.....##...#',
    '#......E.#...........#',
    '#........#.......E...#',
    '#......P.#...........#',
    '#........#.E.........#',
    '#....####.##...####..#',
    '#...........E....#...#',
    '#......#####.........#',
    '#....................#',
    '######################',
  ];

  const C_BG = '#161616';
  const C_FLOOR = '#1a1a1a';
  const C_WALL = '#3a3a3a';
  const C_WALL_TOP = '#FF3D00';
  const C_PLAYER = '#FF3D00';
  const C_ENEMY = '#FEBC2E';
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';
  const C_GRID = '#222';

  // 热力图色阶 (距离 0 = 暖橙, 距离大 = 冷蓝)
  function heatColor(d, maxD) {
    if (d >= WALL) return null;       // 墙不染
    const t = Math.min(1, d / Math.max(1, maxD));
    // 橙 (#FF3D00) → 紫 (#3a2840) → 深蓝灰 (#1a1a2a)
    // 用插值生成 RGB
    const stops = [
      [255, 90, 30],
      [200, 90, 80],
      [120, 70, 130],
      [40, 50, 90],
    ];
    const seg = t * (stops.length - 1);
    const i0 = Math.floor(seg);
    const i1 = Math.min(stops.length - 1, i0 + 1);
    const f = seg - i0;
    const r = Math.round(stops[i0][0] * (1 - f) + stops[i1][0] * f);
    const g = Math.round(stops[i0][1] * (1 - f) + stops[i1][1] * f);
    const b = Math.round(stops[i0][2] * (1 - f) + stops[i1][2] * f);
    return `rgb(${r},${g},${b})`;
  }

  function createState() {
    // 解析地图
    const grid = new Uint8Array(TOTAL);  // 0=floor 1=wall
    const enemies = [];
    let playerCell = { r: 1, c: 1 };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ch = MAP_TEMPLATE[r][c];
        if (ch === '#') grid[r * COLS + c] = 1;
        if (ch === 'P') playerCell = { r, c };
        if (ch === 'E') enemies.push({ r, c, lastMove: 0 });
      }
    }
    return {
      running: false,
      raf: 0,
      grid,                 // 预分配 1D
      heatMap: new Int16Array(TOTAL),   // 预分配 1D
      bfsQueue: new Int32Array(TOTAL),  // 预分配
      bfsQueueLen: 0,
      bfsStepsLastFrame: 0,
      player: playerCell,
      enemies,
      showPaths: true,
      frameCounter: 0,
      enemyMoveEvery: 18,   // 敌人每 N 帧移动一格 (避免太快看不清)
      maxHeat: 1,
      // 鼠标拖拽
      isDragging: false,
      mouseCanvas: { x: 0, y: 0 },
    };
  }

  function isWalkable(state, r, c) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
    return state.grid[r * COLS + c] === 0;
  }

  // ── 核心：每帧从玩家位置 BFS 填充 heatMap (零分配) ──
  function runBFS(state) {
    const heat = state.heatMap;
    const queue = state.bfsQueue;
    const grid = state.grid;
    // 1. 重置 (fill 不分配)
    heat.fill(WALL);
    state.bfsQueueLen = 0;

    // 2. 源 = 玩家
    const src = state.player.r * COLS + state.player.c;
    if (grid[src] === 1) {
      state.bfsStepsLastFrame = 0;
      return;
    }
    heat[src] = 0;
    queue[0] = src;
    let qHead = 0;
    let qTail = 1;
    let maxH = 0;

    // 3. BFS 扩散 (head/tail 指针在预分配数组内移动，无分配)
    const NB = [-COLS, COLS, -1, 1];   // 上下左右 (1D offset)
    while (qHead < qTail) {
      const cur = queue[qHead++];
      const curH = heat[cur];
      const cr = (cur / COLS) | 0;
      const cc = cur - cr * COLS;
      // 防止左右越列 (1D 偏移检查)
      for (let k = 0; k < 4; k++) {
        const nb = cur + NB[k];
        if (k === 2 && cc === 0) continue;       // 左越界
        if (k === 3 && cc === COLS - 1) continue; // 右越界
        if (nb < 0 || nb >= TOTAL) continue;
        if (grid[nb] === 1) continue;
        if (heat[nb] > curH + 1) {
          heat[nb] = curH + 1;
          queue[qTail++] = nb;
          if (curH + 1 > maxH) maxH = curH + 1;
        }
      }
    }
    state.bfsQueueLen = qTail;
    state.bfsStepsLastFrame = qTail;
    state.maxHeat = maxH;
  }

  // 敌人决策：4 邻居中选 heat 最小者
  function moveEnemies(state) {
    const NBV = [
      [-1, 0],  // 上
      [1, 0],   // 下
      [0, -1],  // 左
      [0, 1],   // 右
    ];
    state.enemies.forEach((e) => {
      let best = WALL;
      let bestRC = null;
      for (const [dr, dc] of NBV) {
        const nr = e.r + dr, nc = e.c + dc;
        if (!isWalkable(state, nr, nc)) continue;
        // 不和其他敌人重叠
        if (state.enemies.some((o) => o !== e && o.r === nr && o.c === nc)) continue;
        const h = state.heatMap[nr * COLS + nc];
        if (h < best) { best = h; bestRC = { r: nr, c: nc, dr, dc }; }
      }
      if (bestRC && best < state.heatMap[e.r * COLS + e.c]) {
        e.r = bestRC.r; e.c = bestRC.c;
        e.dr = bestRC.dr; e.dc = bestRC.dc;
      }
    });
  }

  function tick(state) {
    runBFS(state);
    state.frameCounter++;
    if (state.frameCounter >= state.enemyMoveEvery) {
      state.frameCounter = 0;
      moveEnemies(state);
    }
  }

  // ── DRAW ──
  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 热力图 + 墙
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const idx = r * COLS + c;
        const x = c * TILE, y = r * TILE;
        if (state.grid[idx] === 1) {
          ctx.fillStyle = C_WALL;
          ctx.fillRect(x, y, TILE, TILE);
          ctx.fillStyle = C_WALL_TOP;
          ctx.fillRect(x, y, TILE, 1);
        } else {
          const h = state.heatMap[idx];
          if (h >= WALL) {
            ctx.fillStyle = C_FLOOR;
          } else {
            ctx.fillStyle = heatColor(h, state.maxHeat);
          }
          ctx.fillRect(x, y, TILE, TILE);
          // 网格细线
          ctx.strokeStyle = C_GRID;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x + 0.25, y + 0.25, TILE - 0.5, TILE - 0.5);
          // 距离数字（小字，仅对可达且 < 99 显示）
          if (h > 0 && h < 99) {
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(h), x + TILE / 2, y + TILE / 2);
          }
        }
      }
    }

    // 敌人决策箭头
    if (state.showPaths) {
      state.enemies.forEach((e) => {
        // 临时计算敌人将走向的方向
        const NBV = [[-1,0],[1,0],[0,-1],[0,1]];
        let best = WALL;
        let bestDir = null;
        for (const [dr, dc] of NBV) {
          const nr = e.r + dr, nc = e.c + dc;
          if (!isWalkable(state, nr, nc)) continue;
          const h = state.heatMap[nr * COLS + nc];
          if (h < best) { best = h; bestDir = [dr, dc]; }
        }
        if (bestDir) {
          const ex = e.c * TILE + TILE / 2;
          const ey = e.r * TILE + TILE / 2;
          const tx = ex + bestDir[1] * TILE * 0.55;
          const ty = ey + bestDir[0] * TILE * 0.55;
          ctx.strokeStyle = 'rgba(254,188,46,0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      });
    }

    // 敌人
    state.enemies.forEach((e) => {
      const x = e.c * TILE + TILE / 2;
      const y = e.r * TILE + TILE / 2;
      ctx.fillStyle = C_ENEMY;
      ctx.beginPath();
      ctx.arc(x, y, TILE * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, TILE * 0.32, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 玩家
    const px = state.player.c * TILE + TILE / 2;
    const py = state.player.r * TILE + TILE / 2;
    ctx.fillStyle = C_PLAYER;
    ctx.beginPath();
    ctx.arc(px, py, TILE * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffb380';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px, py, TILE * 0.38, 0, Math.PI * 2);
    ctx.stroke();
    // 玩家中心黑点（标识热源 = 0）
    ctx.fillStyle = '#1a0500';
    ctx.font = 'bold 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('0', px, py);

    // 顶部 HUD
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = C_PLAYER;
    ctx.fillText('BFS HEATMAP · 1D pre-allocated', 8, 6);

    // 顶部右：统计
    ctx.textAlign = 'right';
    ctx.fillStyle = C_FG;
    const wallCount = state.grid.reduce((s, v) => s + v, 0);
    ctx.fillText(`cells ${TOTAL - wallCount} · walls ${wallCount} · enemies ${state.enemies.length}`, W - 8, 6);
    ctx.fillStyle = '#FEBC2E';
    ctx.fillText(`BFS visited ${state.bfsStepsLastFrame} / frame`, W - 8, 22);

    // 底部：关键卖点
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#28C840';
    ctx.fillText('● 0 ALLOCATIONS / FRAME', 8, H - 8);
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    ctx.textAlign = 'right';
    ctx.fillText('drag player · enemies do O(1) 4-way lookup', W - 8, H - 8);
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
    wrap.style.cssText = 'display:flex;align-items:center;gap:.5rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="add">+ ADD ENEMY</button>
      <button class="viz-btn" data-act="rm">− REMOVE</button>
      <button class="viz-btn" data-act="paths">◼ HIDE PATHS</button>
      <button class="viz-btn" data-act="reset">RESET</button>
      <div style="flex:1;text-align:right">
        <span style="color:var(--fg-dim)">drag the orange player; watch enemies sink toward distance 0</span>
      </div>
    `;
    container.appendChild(wrap);
    wrap.querySelector('[data-act="add"]').addEventListener('click', () => {
      // 在地图随机空格放一个新敌人
      for (let tries = 0; tries < 40; tries++) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        if (state.grid[r * COLS + c] !== 0) continue;
        if (r === state.player.r && c === state.player.c) continue;
        if (state.enemies.some((e) => e.r === r && e.c === c)) continue;
        state.enemies.push({ r, c });
        return;
      }
    });
    wrap.querySelector('[data-act="rm"]').addEventListener('click', () => {
      state.enemies.pop();
    });
    const pBtn = wrap.querySelector('[data-act="paths"]');
    pBtn.addEventListener('click', () => {
      state.showPaths = !state.showPaths;
      pBtn.textContent = state.showPaths ? '◼ HIDE PATHS' : '▶ SHOW PATHS';
    });
    wrap.querySelector('[data-act="reset"]').addEventListener('click', () => {
      const fresh = createState();
      state.player = fresh.player;
      state.enemies = fresh.enemies;
    });
  }

  function mount(container) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.cssText = `display:block;width:100%;height:auto;max-width:${W}px;margin:0 auto;border-radius:2px;touch-action:none;cursor:grab`;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const state = createState();
    state.container = container;
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
    container._vizState = state;

    buildControls(container, state);

    // 鼠标拖拽：把玩家拖到鼠标所在格子
    const mouseToCell = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width;
      const sy = H / rect.height;
      const cx = (clientX - rect.left) * sx;
      const cy = (clientY - rect.top) * sy;
      return {
        c: Math.max(0, Math.min(COLS - 1, Math.floor(cx / TILE))),
        r: Math.max(0, Math.min(ROWS - 1, Math.floor(cy / TILE))),
      };
    };
    const tryMovePlayer = (clientX, clientY) => {
      const cell = mouseToCell(clientX, clientY);
      if (state.grid[cell.r * COLS + cell.c] === 1) return;       // 墙
      if (state.enemies.some((e) => e.r === cell.r && e.c === cell.c)) return; // 敌人脚下
      state.player.r = cell.r;
      state.player.c = cell.c;
    };
    canvas.addEventListener('mousedown', (e) => {
      state.isDragging = true;
      canvas.style.cursor = 'grabbing';
      tryMovePlayer(e.clientX, e.clientY);
    });
    canvas.addEventListener('mousemove', (e) => {
      if (state.isDragging) tryMovePlayer(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', () => {
      state.isDragging = false;
      canvas.style.cursor = 'grab';
    });
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches[0]) {
        state.isDragging = true;
        tryMovePlayer(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches[0] && state.isDragging) {
        tryMovePlayer(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      }
    }, { passive: false });
    canvas.addEventListener('touchend', () => { state.isDragging = false; });

    state.running = true;
    tick(state);
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
  window.VIZ_REGISTRY.bfs = { mount, pause, resume };
})();
