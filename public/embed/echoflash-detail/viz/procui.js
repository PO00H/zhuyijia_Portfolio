/**
 * 程序化矢量战术 UI 可视化
 * --------------------------------------------------------------
 * 1:1 还原 ECHOFLASH 源码 Player::DrawUI + Player::DrawFeetUI：
 *
 *   核心思路：所有 UI 元素无贴图，全部 sin/cos 实时顶点解算。
 *
 * 1) 方向双段箭头 (DrawUI)
 *    fdx = cos(rotationAngle), fdy = sin(rotationAngle)   // forward
 *    rdx = -sin(rotationAngle), rdy = cos(rotationAngle)  // right
 *    底座箭头：4 个顶点 = pivot + forward*baseRadius ± right * width
 *    延伸箭头：4 个顶点 = pivot + forward*(DASH_BASE_DIST + chargePower)
 *    蓄力时第二个箭头沿 forward 越伸越远 (0 延迟)
 *
 * 2) 脚下战术 UI (DrawFeetUI)
 *    左侧弧 (一闪 CD)：arcMaxSpread * cdLeftRatio
 *    右侧弧 (声呐 CD)：arcMaxSpread * cdRightRatio
 *    背景灰弧 + 上层白色当前进度弧
 *    左弧末端"+" 图标 (在 CD 满时变白)，右弧末端 "●" 图标
 *    蓄力时叠加一个向内收缩的"呼吸圈"
 *
 * 交互：
 *   - 鼠标 / 触屏在 canvas 内移动 → 控制 rotationAngle (面向鼠标)
 *   - 按住左键 → 蓄力 (chargePower 累积，延伸箭头变长)
 *   - 松开左键 → 释放，左侧 CD 进入冷却
 *   - 右键 (或 PULSE RIGHT) → 右侧 CD 进入冷却 (声呐)
 *
 * 接口：window.VIZ_REGISTRY.procui = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  const W = 540, H = 360;

  // 与 PlayerConfig 命名同步
  const FEET_OFFSET_Y = 10;
  const DASH_BASE_DIST = 110;
  const MAX_CHARGE = 32;
  const CHARGE_RATE = 0.55;
  const MAX_CD_LEFT = 110;    // frames
  const MAX_CD_RIGHT = 90;

  // 视觉常量
  const C_BG = '#1a1a1a';
  const C_GROUND = '#161616';
  const C_LINE = '#2a2a2a';
  const C_ACCENT = '#FF3D00';
  const C_WHITE = '#f0f0f0';
  const C_DIM = '#8a8a85';
  const C_GRAY = '#3a3a3a';

  // 玩家固定位置（让 UI 都在 canvas 内）
  const PLAYER_X = W * 0.5;
  const PLAYER_Y = H * 0.55;

  function createState() {
    return {
      running: false,
      raf: 0,
      rotationAngle: 0,
      isCharging: false,
      chargePower: 0,
      auraTime: 0,
      leftCDTimer: 0,
      rightCDTimer: 0,
      // 鼠标 (用于 aim)
      target: { x: PLAYER_X + 120, y: PLAYER_Y - 60 },
      // 自动演示用：模拟左键长按（让 viz 自己跑出蓄力动画）
      autoCharge: true,
      autoPhase: 'idle',       // idle / charging / cd
      autoTimer: 0,
    };
  }

  // ── 演示自动循环：模拟玩家蓄力 → 松开 → CD → 再来 ──
  function tickAuto(state) {
    if (!state.autoCharge) return;
    state.autoTimer++;
    if (state.autoPhase === 'idle') {
      if (state.autoTimer > 60) { state.autoPhase = 'charging'; state.autoTimer = 0; }
    } else if (state.autoPhase === 'charging') {
      state.isCharging = true;
      if (state.chargePower < MAX_CHARGE) state.chargePower += CHARGE_RATE;
      state.auraTime += 0.2 + (state.chargePower / MAX_CHARGE) * 0.8;
      if (state.autoTimer > 110) {
        // 松开
        state.isCharging = false;
        state.leftCDTimer = MAX_CD_LEFT;
        state.chargePower = 0;
        state.auraTime = 0;
        state.autoPhase = 'cd';
        state.autoTimer = 0;
      }
    } else if (state.autoPhase === 'cd') {
      if (state.leftCDTimer <= 0 && state.rightCDTimer <= 0) {
        state.autoPhase = 'idle';
        state.autoTimer = 0;
        // 随机给右键也来一次
        if (Math.random() < 0.5) state.rightCDTimer = MAX_CD_RIGHT;
      }
    }
  }

  function tick(state) {
    // CD cooldown
    if (state.leftCDTimer > 0) state.leftCDTimer--;
    if (state.rightCDTimer > 0) state.rightCDTimer--;

    // rotation 跟随鼠标
    const pivotX = PLAYER_X;
    const pivotY = PLAYER_Y + FEET_OFFSET_Y;
    state.rotationAngle = Math.atan2(state.target.y - pivotY, state.target.x - pivotX);

    tickAuto(state);
  }

  // ── DRAW ──
  function draw(container) {
    const state = container._vizState;
    const ctx = container._vizCtx;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C_BG;
    ctx.fillRect(0, 0, W, H);

    // 底色：浅"地板"圈
    ctx.fillStyle = C_GROUND;
    ctx.beginPath();
    ctx.arc(PLAYER_X, PLAYER_Y + FEET_OFFSET_Y, 150, 0, Math.PI * 2);
    ctx.fill();

    // 顶部信息
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = C_ACCENT;
    ctx.fillText('PROCEDURAL VECTOR UI · sin/cos vertices', 14, 12);
    ctx.textAlign = 'right';
    ctx.fillStyle = C_DIM;
    const angleDeg = (state.rotationAngle * 180 / Math.PI).toFixed(0);
    ctx.fillText(`angle ${angleDeg}° · charge ${state.chargePower.toFixed(0)}/${MAX_CHARGE}`, W - 14, 12);
    ctx.textAlign = 'left';

    // 鼠标位置
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(state.target.x, state.target.y, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    drawPlayer(ctx, state);
    drawFeetUI(ctx, state);
    drawDirectionalUI(ctx, state);

    // 图例（底部）
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = C_DIM;
    const legendY = H - 14;
    ctx.fillText('▲ base arrow  ▶ extension (charge)  ◗ CD arc  +/● ability icons', 14, legendY);

    // 状态文字（右下）
    ctx.textAlign = 'right';
    let status = 'IDLE';
    let statusColor = C_DIM;
    if (state.isCharging) { status = 'CHARGING ▸ press release'; statusColor = '#FEBC2E'; }
    else if (state.leftCDTimer > 0 && state.rightCDTimer > 0) { status = 'BOTH ON CD'; statusColor = C_GRAY; }
    else if (state.leftCDTimer > 0) { status = `DASH CD ${(state.leftCDTimer / MAX_CD_LEFT * 100).toFixed(0)}%`; statusColor = C_ACCENT; }
    else if (state.rightCDTimer > 0) { status = `SONAR CD ${(state.rightCDTimer / MAX_CD_RIGHT * 100).toFixed(0)}%`; statusColor = '#FEBC2E'; }
    ctx.fillStyle = statusColor;
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(status, W - 14, legendY);
    ctx.textAlign = 'left';
  }

  function drawPlayer(ctx, state) {
    // 玩家"精灵"用一个简单的圆 + 朝向小线段表示
    ctx.fillStyle = C_ACCENT;
    ctx.beginPath();
    ctx.arc(PLAYER_X, PLAYER_Y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffb380';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(PLAYER_X, PLAYER_Y, 7, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 还原 DrawUI: 双段方向箭头
  function drawDirectionalUI(ctx, state) {
    const pivotX = PLAYER_X;
    const pivotY = PLAYER_Y + FEET_OFFSET_Y;
    const a = state.rotationAngle;
    const fdx = Math.cos(a);
    const fdy = Math.sin(a);
    const rdx = -Math.sin(a);
    const rdy = Math.cos(a);

    // ─── 底座箭头 ───
    const baseRadius = 45;
    const cx1 = pivotX + fdx * baseRadius;
    const cy1 = pivotY + fdy * baseRadius;
    const t1 = { length: 8, width: 8, depth: 5, indent: 1 };
    const pts1 = [
      [cx1 + fdx * t1.length,                cy1 + fdy * t1.length],
      [cx1 - fdx * t1.depth - rdx * t1.width, cy1 - fdy * t1.depth - rdy * t1.width],
      [cx1 - fdx * t1.indent,                cy1 - fdy * t1.indent],
      [cx1 - fdx * t1.depth + rdx * t1.width, cy1 - fdy * t1.depth + rdy * t1.width],
    ];
    fillPoly(ctx, pts1, C_WHITE);

    // ─── 延伸箭头 ───
    let extensionOffset = DASH_BASE_DIST - baseRadius;
    if (state.isCharging) extensionOffset += state.chargePower * 1.0;
    const chargeDistance = baseRadius + extensionOffset;
    const cx2 = pivotX + fdx * chargeDistance;
    const cy2 = pivotY + fdy * chargeDistance;
    const t2 = { length: 12, width: 5, depth: 6, indent: 2 };
    const pts2 = [
      [cx2 + fdx * t2.length,                cy2 + fdy * t2.length],
      [cx2 - fdx * t2.depth - rdx * t2.width, cy2 - fdy * t2.depth - rdy * t2.width],
      [cx2 - fdx * t2.indent,                cy2 - fdy * t2.indent],
      [cx2 - fdx * t2.depth + rdx * t2.width, cy2 - fdy * t2.depth + rdy * t2.width],
    ];
    // 蓄力时延伸箭头染色
    const extColor = state.isCharging ? C_ACCENT : C_WHITE;
    fillPoly(ctx, pts2, extColor);

    // 连接线（虚线）从底座到延伸
    ctx.strokeStyle = state.isCharging ? 'rgba(255,61,0,0.5)' : 'rgba(240,240,240,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(cx1, cy1);
    ctx.lineTo(cx2 - fdx * t2.depth, cy2 - fdy * t2.depth);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function fillPoly(ctx, pts, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fill();
  }

  // 还原 DrawFeetUI: 脚下扇形 CD + 蓄力呼吸圈
  function drawFeetUI(ctx, state) {
    const footX = PLAYER_X;
    const footY = PLAYER_Y + FEET_OFFSET_Y;

    // ─── 蓄力呼吸圈 ───
    if (state.isCharging) {
      const maxR = 30;
      const shrinkSpeed = 3;
      const currentRadius = maxR - ((state.auraTime * shrinkSpeed) % maxR);
      const inverseFade = 1 - currentRadius / maxR;
      const maxThickness = 2 + state.chargePower / 25;
      const lineWidth = Math.max(0, Math.round(maxThickness * inverseFade));
      if (lineWidth > 0 && currentRadius > 1) {
        ctx.strokeStyle = `rgba(200,200,200,${0.3 + inverseFade * 0.5})`;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(footX, footY, currentRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // ─── 双侧 CD 弧 ───
    // 鼠标 → aimAngle (注意 canvas Y 向下，与游戏代码 Y 反向：游戏里 footY - mouseY)
    const dxM = state.target.x - footX;
    const dyM = state.target.y - footY;
    const aimAngle = Math.atan2(-dyM, dxM);

    const outerRadius = 32;
    const arcMaxSpread = Math.PI * 0.35;
    const gap = 0.15;
    const uiLineWidth = 4;
    const cdLeftRatio = 1 - state.leftCDTimer / MAX_CD_LEFT;
    const cdRightRatio = 1 - state.rightCDTimer / MAX_CD_RIGHT;

    const leftInnerAnchor = aimAngle + gap;
    const rightInnerAnchor = aimAngle - gap;

    // 左弧背景 (DASH)
    drawCanvasArc(ctx, footX, footY, outerRadius, leftInnerAnchor, leftInnerAnchor + arcMaxSpread, C_GRAY, uiLineWidth);
    // 左弧进度
    const leftSpread = arcMaxSpread * cdLeftRatio;
    if (leftSpread > 0.02) {
      drawCanvasArc(ctx, footX, footY, outerRadius, leftInnerAnchor, leftInnerAnchor + leftSpread, C_WHITE, uiLineWidth);
    }
    // 左弧末端 + 图标
    const leftIconAngle = leftInnerAnchor + arcMaxSpread;
    const leftIconColor = cdLeftRatio >= 1 ? C_WHITE : '#646464';
    drawPlusIcon(ctx, footX + outerRadius * Math.cos(leftIconAngle), footY - outerRadius * Math.sin(leftIconAngle), 6, leftIconColor);

    // 右弧背景 (SONAR)
    drawCanvasArc(ctx, footX, footY, outerRadius, rightInnerAnchor - arcMaxSpread, rightInnerAnchor, C_GRAY, uiLineWidth);
    // 右弧进度
    const rightSpread = arcMaxSpread * cdRightRatio;
    if (rightSpread > 0.02) {
      drawCanvasArc(ctx, footX, footY, outerRadius, rightInnerAnchor - rightSpread, rightInnerAnchor, C_WHITE, uiLineWidth);
    }
    // 右弧末端 ● 图标
    const rightIconAngle = rightInnerAnchor - arcMaxSpread;
    const rightIconColor = cdRightRatio >= 1 ? C_WHITE : '#646464';
    drawDotIcon(ctx, footX + outerRadius * Math.cos(rightIconAngle), footY - outerRadius * Math.sin(rightIconAngle), 6, rightIconColor);
  }

  // Canvas arc 用游戏代码的 (yFlip) 角度坐标系
  function drawCanvasArc(ctx, cx, cy, r, ang1, ang2, color, lineWidth) {
    // 源码用 EasyX 的 arc()，Y 向上为正角度；canvas 是 Y 向下，需要翻转 Y
    // 用 ellipse(... -ang2, -ang1) 实现镜像
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.ellipse(cx, cy, r, r, 0, -ang2, -ang1);
    ctx.stroke();
  }

  function drawPlusIcon(ctx, x, y, size, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.stroke();
  }
  function drawDotIcon(ctx, x, y, size, color) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── 主循环 ──
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
      <button class="viz-btn" data-act="dash">▶ TRIGGER DASH</button>
      <button class="viz-btn" data-act="sonar">▶ TRIGGER SONAR</button>
      <button class="viz-btn" data-act="auto">◼ STOP AUTO</button>
      <div style="color:var(--fg-dim);flex:1;text-align:right">
        <span style="color:var(--fg-dim)">hint:</span>
        <span style="color:var(--fg)">move cursor to aim</span>
      </div>
    `;
    container.appendChild(wrap);

    wrap.querySelector('[data-act="dash"]').addEventListener('click', () => {
      // 手动模拟蓄力周期：直接给一次 charge 然后释放
      state.autoCharge = false;
      state.isCharging = true;
      state.chargePower = MAX_CHARGE * 0.8;
      state.auraTime = 5;
      // 1 秒后释放
      setTimeout(() => {
        state.isCharging = false;
        state.leftCDTimer = MAX_CD_LEFT;
        state.chargePower = 0;
        state.auraTime = 0;
      }, 800);
    });
    wrap.querySelector('[data-act="sonar"]').addEventListener('click', () => {
      state.rightCDTimer = MAX_CD_RIGHT;
    });
    const autoBtn = wrap.querySelector('[data-act="auto"]');
    autoBtn.addEventListener('click', () => {
      state.autoCharge = !state.autoCharge;
      autoBtn.textContent = state.autoCharge ? '◼ STOP AUTO' : '▶ AUTO LOOP';
      autoBtn.style.background = state.autoCharge ? 'var(--accent)' : 'transparent';
      autoBtn.style.color = state.autoCharge ? '#000' : 'var(--accent)';
    });
    // 初始 AUTO 处于 ON
    autoBtn.style.background = 'var(--accent)';
    autoBtn.style.color = '#000';
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
    container._vizCanvas = canvas;
    container._vizCtx = ctx;
    container._vizState = state;

    buildControls(container, state);

    // 鼠标 / 触屏控制 aim
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

    state.running = true;
    draw(container);  // 同步首帧
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
  window.VIZ_REGISTRY.procui = { mount, pause, resume };
})();
