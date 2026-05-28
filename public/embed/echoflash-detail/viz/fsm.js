/**
 * 场景状态机调度可视化 (顶层 FSM)
 * --------------------------------------------------------------
 * 1:1 还原 ECHOFLASH 源码 enum class GameState 与 Game::Update 里
 * 实际触发的所有状态转换：
 *
 *   MENU      <─ 主菜单
 *   STORYBOARD ── 剧情过场
 *   TUTORIAL   ── 教程
 *   PLAYING    ── 游戏进行中  (中心)
 *   PAUSED     ── 暂停
 *   GAMEOVER   ── 死亡
 *   VICTORY    ── 关卡胜利
 *   ENDING     ── (源码 enum 预留, 未触发)
 *
 * 共 15+ 条真实转换边，覆盖：按键触发 (ENTER/ESC/R/F)、UI 按钮、
 * 游戏事件 (撞敌/通关) 等。
 *
 * 演示形式：
 *   - 8 个状态节点按游戏流程排布
 *   - 当前激活节点 = 橙色脉冲发光
 *   - 所有合法转换边 = 灰色，命中起点时高亮成橙色
 *   - 点击节点 = 走对应的合法路径（不合法的灰色按钮禁用）
 *   - 点击边上的小数字标签 = 触发该转换 (显示 "trigger: ESC" 等)
 *
 * 接口：window.VIZ_REGISTRY.fsm = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  const W = 640, H = 420;

  // ── 节点定义（id, label, position）──
  const NODES = [
    { id: 'MENU',       label: 'MENU',       x: 110, y:  60 },
    { id: 'STORYBOARD', label: 'STORYBOARD', x: 320, y:  60 },
    { id: 'TUTORIAL',   label: 'TUTORIAL',   x: 530, y:  60 },
    { id: 'PLAYING',    label: 'PLAYING',    x: 320, y: 200 },
    { id: 'PAUSED',     label: 'PAUSED',     x: 530, y: 200 },
    { id: 'GAMEOVER',   label: 'GAMEOVER',   x: 200, y: 340 },
    { id: 'VICTORY',    label: 'VICTORY',    x: 440, y: 340 },
    { id: 'ENDING',     label: 'ENDING',     x: 110, y: 200, reserved: true },
  ];
  const NODE_W = 100, NODE_H = 36;

  // ── 转换定义（from, to, trigger）──
  const TRANSITIONS = [
    // From MENU
    { from: 'MENU',       to: 'STORYBOARD', trig: 'NEW GAME / Enter',     curve: 0 },
    { from: 'MENU',       to: 'PLAYING',    trig: 'CONTINUE',             curve: 0.3 },
    // From STORYBOARD
    { from: 'STORYBOARD', to: 'TUTORIAL',   trig: 'pages cleared',        curve: 0 },
    { from: 'STORYBOARD', to: 'VICTORY',    trig: 'after final boss',     curve: -0.4 },
    // From TUTORIAL
    { from: 'TUTORIAL',   to: 'PLAYING',    trig: 'any key',              curve: 0 },
    // PLAYING ↔ PAUSED
    { from: 'PLAYING',    to: 'PAUSED',     trig: 'ESC',                  curve: 0.2 },
    { from: 'PAUSED',     to: 'PLAYING',    trig: 'ESC / RESUME',         curve: 0.2 },
    // PAUSED 出口
    { from: 'PAUSED',     to: 'MENU',       trig: 'main menu btn',        curve: -0.5 },
    { from: 'PAUSED',     to: 'PLAYING',    trig: 'RESTART btn (reset)',  curve: -0.3, dashed: true },
    // PLAYING 终态
    { from: 'PLAYING',    to: 'GAMEOVER',   trig: 'enemy collision',      curve: -0.2 },
    { from: 'PLAYING',    to: 'VICTORY',    trig: 'F · level cleared',    curve: 0.2 },
    { from: 'PLAYING',    to: 'STORYBOARD', trig: 'F · all 3 levels done',curve: -0.6 },
    // GAMEOVER 出口
    { from: 'GAMEOVER',   to: 'PLAYING',    trig: 'R / RESTART',          curve: 0 },
    { from: 'GAMEOVER',   to: 'MENU',       trig: 'main menu btn',        curve: 0.3 },
    // VICTORY 出口
    { from: 'VICTORY',    to: 'PLAYING',    trig: 'ENTER · next level',   curve: 0 },
    { from: 'VICTORY',    to: 'MENU',       trig: 'main menu btn',        curve: -0.4 },
  ];

  const C_BG = '#1a1a1a';
  const C_GRID = '#222';
  const C_NODE = '#222';
  const C_NODE_BORDER = '#3a3a3a';
  const C_NODE_LABEL = '#8a8a85';
  const C_NODE_RESERVED_LABEL = '#555';
  const C_ACTIVE = '#FF3D00';
  const C_ACTIVE_GLOW = 'rgba(255,61,0,0.35)';
  const C_EDGE = '#2e2e2e';
  const C_EDGE_OUT = '#FEBC2E';     // 当前节点 outgoing 边
  const C_FG = '#f0f0f0';
  const C_DIM = '#8a8a85';

  function createState() {
    return {
      running: false,
      raf: 0,
      current: 'MENU',
      pulseT: 0,
      // 边动画
      lastTransitionEdgeIdx: -1,
      lastTransitionT: 0,
      // hover 节点
      hoverNode: null,
      // hover transition (用于工具提示)
      hoverEdge: null,
      // 历史路径 (顺序 state 名)
      history: ['MENU'],
      mouseCanvas: { x: 0, y: 0 },
    };
  }

  function getNode(id) {
    return NODES.find((n) => n.id === id);
  }

  function nodeContains(node, x, y) {
    return x >= node.x - NODE_W / 2 && x <= node.x + NODE_W / 2 &&
           y >= node.y - NODE_H / 2 && y <= node.y + NODE_H / 2;
  }

  // 计算贝塞尔曲线在 t 时刻的点（用于命中检测和绘制）
  function quadPoint(p0, p1, p2, t) {
    const it = 1 - t;
    return {
      x: it * it * p0.x + 2 * it * t * p1.x + t * t * p2.x,
      y: it * it * p0.y + 2 * it * t * p1.y + t * t * p2.y,
    };
  }

  // 给一条转换计算控制点 (基于 curve 参数)
  function edgeControl(from, to, curve) {
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    // 垂直于 from-to 方向的偏移
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    if (len < 1) return { x: mx, y: my };
    return {
      x: mx + (-dy / len) * curve * 80,
      y: my + ( dx / len) * curve * 80,
    };
  }

  // 边-节点交界点 (边起点/终点应落在节点矩形边沿，避免覆盖文字)
  function edgeAnchor(node, towardX, towardY) {
    const dx = towardX - node.x;
    const dy = towardY - node.y;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return { x: node.x, y: node.y };
    const sx = (NODE_W / 2) / Math.abs(dx);
    const sy = (NODE_H / 2) / Math.abs(dy);
    const s = Math.min(sx, sy);
    return { x: node.x + dx * s, y: node.y + dy * s };
  }

  function trigger(state, fromId, toId) {
    const idx = TRANSITIONS.findIndex((t) => t.from === fromId && t.to === toId);
    if (idx < 0) return false;
    state.current = toId;
    state.lastTransitionEdgeIdx = idx;
    state.lastTransitionT = 0;
    state.history.push(toId);
    if (state.history.length > 12) state.history.shift();
    return true;
  }

  // ── DRAW ──
  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 网格点
    ctx.fillStyle = C_GRID;
    for (let y = 20; y < H; y += 40) {
      for (let x = 20; x < W; x += 40) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    state.pulseT += 0.06;
    state.lastTransitionT += 0.04;

    // 绘制所有转换边
    TRANSITIONS.forEach((tr, i) => {
      const from = getNode(tr.from);
      const to = getNode(tr.to);
      if (!from || !to) return;
      const ctrl = edgeControl(from, to, tr.curve);
      const startA = edgeAnchor(from, ctrl.x, ctrl.y);
      const endA   = edgeAnchor(to, ctrl.x, ctrl.y);

      const isOutgoing = state.current === tr.from;
      const isAnimating = i === state.lastTransitionEdgeIdx && state.lastTransitionT < 1.2;
      const isHover = state.hoverEdge === i;

      // 主体线
      ctx.strokeStyle = isOutgoing ? C_EDGE_OUT : (isHover ? '#444' : C_EDGE);
      ctx.lineWidth = isOutgoing || isHover ? 1.5 : 1;
      if (tr.dashed) ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(startA.x, startA.y);
      ctx.quadraticCurveTo(ctrl.x, ctrl.y, endA.x, endA.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // 箭头头
      // 在 t=0.92 处取方向
      const p1 = quadPoint(startA, ctrl, endA, 0.85);
      const p2 = quadPoint(startA, ctrl, endA, 1.0);
      const a = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const ah = 7;
      ctx.fillStyle = isOutgoing ? C_EDGE_OUT : (isHover ? '#666' : C_EDGE);
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2.x - Math.cos(a) * ah + Math.cos(a + Math.PI / 2) * ah * 0.6,
                 p2.y - Math.sin(a) * ah + Math.sin(a + Math.PI / 2) * ah * 0.6);
      ctx.lineTo(p2.x - Math.cos(a) * ah - Math.cos(a + Math.PI / 2) * ah * 0.6,
                 p2.y - Math.sin(a) * ah - Math.sin(a + Math.PI / 2) * ah * 0.6);
      ctx.closePath();
      ctx.fill();

      // 转换动画 (小亮点沿边滑过)
      if (isAnimating) {
        const t = Math.min(1, state.lastTransitionT);
        const dot = quadPoint(startA, ctrl, endA, t);
        ctx.fillStyle = C_ACTIVE;
        ctx.shadowColor = C_ACTIVE;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // hover 时显示 trigger 文字
      if (isHover) {
        const mid = quadPoint(startA, ctrl, endA, 0.5);
        ctx.font = '10px "JetBrains Mono", monospace';
        const text = tr.trig;
        const tw = ctx.measureText(text).width + 10;
        const th = 16;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(mid.x - tw / 2, mid.y - th / 2, tw, th);
        ctx.strokeStyle = C_EDGE_OUT;
        ctx.lineWidth = 1;
        ctx.strokeRect(mid.x - tw / 2 + 0.5, mid.y - th / 2 + 0.5, tw - 1, th - 1);
        ctx.fillStyle = C_EDGE_OUT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, mid.x, mid.y);
      }
    });

    // 绘制节点
    NODES.forEach((n) => {
      const isCurrent = state.current === n.id;
      const isHover = state.hoverNode === n.id;
      const isOutgoingTarget = TRANSITIONS.some((t) => t.from === state.current && t.to === n.id);
      const x = n.x - NODE_W / 2;
      const y = n.y - NODE_H / 2;

      // 发光
      if (isCurrent) {
        const pulseR = 8 + Math.sin(state.pulseT) * 3;
        ctx.fillStyle = C_ACTIVE_GLOW;
        ctx.fillRect(x - pulseR, y - pulseR, NODE_W + pulseR * 2, NODE_H + pulseR * 2);
      }

      // 节点底
      ctx.fillStyle = isCurrent ? C_ACTIVE : C_NODE;
      ctx.fillRect(x, y, NODE_W, NODE_H);
      // 节点边框
      let borderColor = C_NODE_BORDER;
      if (isCurrent) borderColor = '#ff8c42';
      else if (isOutgoingTarget) borderColor = C_EDGE_OUT;
      else if (isHover) borderColor = '#666';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = isCurrent ? 2 : 1;
      ctx.strokeRect(x + 0.5, y + 0.5, NODE_W - 1, NODE_H - 1);

      // 文本
      ctx.font = isCurrent ? 'bold 11px "JetBrains Mono", monospace' : '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isCurrent ? '#000' : (n.reserved ? C_NODE_RESERVED_LABEL : C_NODE_LABEL);
      ctx.fillText(n.label, n.x, n.y);
      if (n.reserved) {
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#444';
        ctx.fillText('(reserved)', n.x, n.y + 14);
      }
    });

    // 顶部信息
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = C_ACTIVE;
    ctx.fillText('FSM · enum class GameState', 12, 10);
    ctx.textAlign = 'right';
    ctx.fillStyle = C_DIM;
    ctx.fillText(`${NODES.length} states · ${TRANSITIONS.length} transitions`, W - 12, 10);

    // 底部历史路径
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = C_DIM;
    const histText = 'path: ' + state.history.join(' → ');
    ctx.fillText(histText.length > 90 ? histText.slice(-90) : histText, 12, H - 10);
  }

  function loop(container) {
    const state = container._vizState;
    if (!state.running) return;
    draw(container);
    state.raf = requestAnimationFrame(() => loop(container));
  }

  // ── HIT TESTS ──
  function hitNode(state, x, y) {
    for (const n of NODES) {
      if (nodeContains(n, x, y)) return n;
    }
    return null;
  }
  function hitEdgeIdx(state, x, y) {
    // 检查曲线附近点，回退到中点附近 ±12px
    for (let i = 0; i < TRANSITIONS.length; i++) {
      const tr = TRANSITIONS[i];
      const from = getNode(tr.from);
      const to = getNode(tr.to);
      if (!from || !to) continue;
      const ctrl = edgeControl(from, to, tr.curve);
      const startA = edgeAnchor(from, ctrl.x, ctrl.y);
      const endA   = edgeAnchor(to, ctrl.x, ctrl.y);
      // 沿曲线采样 30 点找最近点
      for (let s = 0; s <= 1; s += 0.05) {
        const p = quadPoint(startA, ctrl, endA, s);
        if (Math.hypot(p.x - x, p.y - y) < 8) return i;
      }
    }
    return -1;
  }

  // ── CONTROLS ──
  function buildControls(container, state) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:.75rem;margin-top:.75rem;padding-top:.75rem;border-top:1px solid var(--line);flex-wrap:wrap;font-family:var(--mono);font-size:10px';
    wrap.innerHTML = `
      <button class="viz-btn" data-act="reset">▶ RESET TO MENU</button>
      <div style="color:var(--fg-dim);flex:1;text-align:right">
        <span style="color:var(--fg-dim)">hint:</span>
        <span style="color:var(--fg)">click a node to transition; hover edges to see trigger</span>
      </div>
    `;
    container.appendChild(wrap);
    wrap.querySelector('[data-act="reset"]').addEventListener('click', () => {
      state.current = 'MENU';
      state.history = ['MENU'];
      state.lastTransitionEdgeIdx = -1;
    });
  }

  function mount(container) {
    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.cssText = `display:block;width:100%;height:auto;max-width:${W}px;margin:0 auto;border-radius:2px;touch-action:none;cursor:default`;
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const state = createState();
    state.container = container;
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
    container._vizState = state;

    buildControls(container, state);

    const canvasPt = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const sx = W / rect.width;
      return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sx };
    };

    canvas.addEventListener('mousemove', (e) => {
      const p = canvasPt(e.clientX, e.clientY);
      state.mouseCanvas = p;
      const n = hitNode(state, p.x, p.y);
      state.hoverNode = n ? n.id : null;
      state.hoverEdge = n ? null : hitEdgeIdx(state, p.x, p.y);
      // 改变光标提示
      const canTransition = state.hoverNode &&
        state.hoverNode !== state.current &&
        TRANSITIONS.some((t) => t.from === state.current && t.to === state.hoverNode);
      canvas.style.cursor = (canTransition || state.hoverEdge >= 0) ? 'pointer' : 'default';
    });
    canvas.addEventListener('click', (e) => {
      const p = canvasPt(e.clientX, e.clientY);
      const n = hitNode(state, p.x, p.y);
      if (n && n.id !== state.current) {
        trigger(state, state.current, n.id);
        return;
      }
      const ei = hitEdgeIdx(state, p.x, p.y);
      if (ei >= 0) {
        const tr = TRANSITIONS[ei];
        if (tr.from === state.current) {
          trigger(state, tr.from, tr.to);
        }
      }
    });
    canvas.addEventListener('touchend', (e) => {
      if (!e.changedTouches[0]) return;
      const t = e.changedTouches[0];
      const p = canvasPt(t.clientX, t.clientY);
      const n = hitNode(state, p.x, p.y);
      if (n && n.id !== state.current) trigger(state, state.current, n.id);
    });

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
  window.VIZ_REGISTRY.fsm = { mount, pause, resume };
})();
