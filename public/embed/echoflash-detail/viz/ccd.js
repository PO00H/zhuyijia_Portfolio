/**
 * CCD 连续碰撞检测可视化
 * --------------------------------------------------------------
 * 600×220 Canvas，上下两半对比：
 *   上半 "Naive": 玩家每帧直接 += speed，速度高时会"穿过"墙
 *   下半 "CCD":   把同一位移切成 N 个微步，每步 AABB 检测，撞墙就停
 *
 * 自动循环：每 4 秒一轮（蓄力 → 突进 → 停顿 → 重置）
 * 交互：
 *   - 滑块调突进速度 5~50 px/step
 *   - 鼠标 / 触屏拖动滑块均可（HTML range 原生兼容）
 *
 * 接口：window.VIZ_REGISTRY.ccd = { mount, pause, resume }
 * --------------------------------------------------------------
 */
(function () {
  'use strict';

  const W = 600, H = 220;
  const STEPS = 8;          // CCD 每帧拆 8 个微步
  const PLAYER_W = 28;
  const WALL_X = 380;       // 墙的左边沿 X
  const WALL_W = 36;
  const LOOP_MS = 4000;     // 一轮循环 4 秒

  /** 单实例状态（mount 时初始化）*/
  function createState() {
    return {
      raf: 0,
      running: false,
      speed: 22,          // px/step，初始值
      startTs: 0,
      // 两个玩家各自状态
      naive: { x: 60, hit: false, hitFrame: -1 },
      ccd: { x: 60, hit: false, hitFrame: -1, subSteps: [] },
    };
  }

  function aabbHit(x, w) {
    return x + w > WALL_X && x < WALL_X + WALL_W;
  }

  function drawScene(ctx, state, t) {
    ctx.clearRect(0, 0, W, H);

    // ── 顶部 / 底部背景轨道 ──
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 20, W, 80);    // 上半
    ctx.fillRect(0, 120, W, 80);   // 下半

    // ── 墙（两半都有）──
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(WALL_X, 20, WALL_W, 80);
    ctx.fillRect(WALL_X, 120, WALL_W, 80);
    // 墙体高光线
    ctx.fillStyle = '#FF3D00';
    ctx.fillRect(WALL_X, 20, 2, 80);
    ctx.fillRect(WALL_X, 120, 2, 80);

    // ── 标签 ──
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#8A8A85';
    ctx.fillText('NAIVE  · direct add', 12, 6);
    ctx.fillText('CCD    · sub-step + AABB', 12, 106);

    // ── 上半：Naive 玩家 ──
    const naive = state.naive;
    ctx.fillStyle = naive.hit ? '#FF5F57' : '#FF3D00';
    ctx.fillRect(naive.x, 46, PLAYER_W, 28);

    // 状态标签（右侧）
    if (t > LOOP_MS * 0.8) {
      const passed = naive.x > WALL_X + WALL_W;
      ctx.fillStyle = passed ? '#FF5F57' : '#28C840';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(passed ? 'BUG · PHASED THROUGH' : 'OK', W - 180, 46);
    }

    // ── 下半：CCD 玩家 ──
    const ccd = state.ccd;
    // 微步残影（最近的几个）
    ccd.subSteps.forEach((sx, i) => {
      const alpha = (i + 1) / ccd.subSteps.length * 0.4;
      ctx.fillStyle = `rgba(255,61,0,${alpha})`;
      ctx.fillRect(sx, 146, PLAYER_W, 28);
    });
    ctx.fillStyle = ccd.hit ? '#FF5F57' : '#FF3D00';
    ctx.fillRect(ccd.x, 146, PLAYER_W, 28);
    // 撞墙时的小爆点（红色三角）
    if (ccd.hit) {
      ctx.fillStyle = '#FF5F57';
      ctx.beginPath();
      ctx.moveTo(WALL_X - 4, 156);
      ctx.lineTo(WALL_X - 14, 150);
      ctx.lineTo(WALL_X - 14, 162);
      ctx.fill();
    }
    // 状态标签
    if (t > LOOP_MS * 0.8) {
      ctx.fillStyle = ccd.hit ? '#28C840' : '#8A8A85';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText(ccd.hit ? 'OK · STOPPED AT WALL' : 'IDLE', W - 180, 146);
    }

    // ── 进度条 ──
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, H - 4, W, 4);
    ctx.fillStyle = '#FF3D00';
    ctx.fillRect(0, H - 4, (t % LOOP_MS) / LOOP_MS * W, 4);
  }

  function tick(state, ctx, ts) {
    if (!state.startTs) state.startTs = ts;
    const t = (ts - state.startTs) % LOOP_MS;

    // 0-800ms 蓄力（不动） / 800-2400ms 突进 / 2400-4000ms 停顿
    if (t < 800) {
      // reset
      state.naive.x = 60;
      state.naive.hit = false;
      state.ccd.x = 60;
      state.ccd.hit = false;
      state.ccd.subSteps = [];
    } else if (t < 2400) {
      // 突进
      // Naive: 每帧直接加 speed × 2.5（夸张速度让 bug 明显）
      if (!state.naive.hit) {
        const next = state.naive.x + state.speed * 2.5;
        // 检测：但 naive 不做切片，只在最后位置检测，所以高速会穿墙
        if (next < W - PLAYER_W) {
          state.naive.x = next;
        }
        // 标 bug：如果 next 已经过了墙的右边
        if (next > WALL_X + WALL_W) {
          state.naive.hit = false; // 没"撞到"，但视觉上穿过去了
        }
      }
      // CCD: 同样大位移，但切片
      if (!state.ccd.hit) {
        const totalDelta = state.speed * 2.5;
        const stepDelta = totalDelta / STEPS;
        let curX = state.ccd.x;
        const recent = [];
        for (let i = 0; i < STEPS; i++) {
          const nx = curX + stepDelta;
          recent.push(nx);
          if (aabbHit(nx, PLAYER_W)) {
            // 退回到刚好贴着墙
            curX = WALL_X - PLAYER_W;
            state.ccd.hit = true;
            break;
          }
          curX = nx;
        }
        state.ccd.x = curX;
        state.ccd.subSteps = recent.slice(0, 5); // 保留最近 5 个残影
      }
    }
    // 2400-4000ms 停顿，状态保持

    drawScene(ctx, state, t);
  }

  function mount(container) {
    container.innerHTML = '';

    // canvas
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    // 控制栏（slider）
    const controls = document.createElement('div');
    controls.className = 'viz-slider';
    controls.innerHTML = `
      <span style="font-family:var(--mono);font-size:10px;color:var(--fg-mute)">SPEED</span>
      <input type="range" min="5" max="50" value="22" step="1" aria-label="CCD speed" />
      <span class="speed-val" style="font-family:var(--mono);font-size:10px;color:var(--accent);min-width:30px">22</span>
    `;
    controls.style.cssText = 'display:flex;align-items:center;gap:.75rem;padding:.5rem .25rem 0;';
    container.appendChild(controls);

    const ctx = canvas.getContext('2d');
    const state = createState();
    container._vizState = state;
    container._vizCanvas = canvas;

    // 绑定 slider（鼠标 + 触屏原生支持）
    const slider = controls.querySelector('input');
    const valLabel = controls.querySelector('.speed-val');
    slider.addEventListener('input', () => {
      state.speed = parseInt(slider.value, 10);
      valLabel.textContent = slider.value;
    });
    // touchmove fallback：原生 input[type=range] 在大多数浏览器已支持 touch，
    // 不过 iOS Safari 上还可以加 touchstart 让用户更容易开始拖
    slider.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

    function loop(ts) {
      if (!state.running) return;
      tick(state, ctx, ts);
      state.raf = requestAnimationFrame(loop);
    }

    state.running = true;
    state.raf = requestAnimationFrame(loop);
    container._vizLoop = loop;
  }

  function pause(container) {
    const state = container._vizState;
    if (!state) return;
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  function resume(container) {
    const state = container._vizState;
    if (!state || state.running) return;
    state.running = true;
    state.startTs = 0;  // 重置时间基准，从头开始一轮
    state.raf = requestAnimationFrame(container._vizLoop);
  }

  window.VIZ_REGISTRY = window.VIZ_REGISTRY || {};
  window.VIZ_REGISTRY.ccd = { mount, pause, resume };
})();
