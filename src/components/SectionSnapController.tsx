import { useEffect } from 'react';

/**
 * About ↔ Works 边界"软浏览 / 硬跳页"控制器
 * ----------------------------------------------------------
 * 行为：
 * - 用户在 #about 内部正常滚动；滚到底部时停在 Works 之前一帧
 * - 在边界继续往下滚：250ms 窗口内累计 |deltaY| 超 400px → smooth scroll 到 #works-index 顶端
 * - 反方向同理：在 #works-index 顶端继续往上滚 → 累计超阈值跳回 #about 底端
 * - 跳转中 / 跳转后 600ms 冷却
 * - 触屏 / Lightbox 打开期间禁用（避免和触摸滚动 / 模态框冲突）
 * - Works ↔ Work Details 边界不拦截（保持原生）
 *
 * 实现备注：
 * - 直接在 window 上 wheel 监听，非 passive（需要 preventDefault）
 * - "边界"判定：section 的 top/bottom 到达 viewport 顶端 / 底端的 ±3px 窗口
 */
const SNAP_THRESHOLD = 400;   // px 累计触发跳页
const ACCUM_WINDOW = 250;     // ms 累加窗口
const COOLDOWN = 600;         // ms 跳转后冷却
const SCROLL_DURATION = 700;  // ms smooth scroll 动画时长
const BOUNDARY_TOL = 4;       // px 边界容差

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY: number, duration: number): Promise<void> {
  return new Promise((resolve) => {
    const startY = window.scrollY;
    const dist = targetY - startY;
    if (Math.abs(dist) < 1) { resolve(); return; }
    const startT = performance.now();
    function step(now: number) {
      const t = Math.min(1, (now - startT) / duration);
      // 必须 instant，否则会和 CSS scroll-behavior:smooth 叠加 → 动画混乱
      window.scrollTo({ top: startY + dist * easeInOutCubic(t), behavior: 'instant' as ScrollBehavior });
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    }
    requestAnimationFrame(step);
  });
}

// 钳位用：强制瞬时跳，绕过 CSS scroll-behavior:smooth
function instantScrollTo(y: number) {
  window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
}

export function SectionSnapController() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 触屏不启用（移动端用 touchmove，行为差别太大，先保留原生）
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let accumulated = 0;
    let lastWheelTime = 0;
    let animating = false;
    let cooldownUntil = 0;

    function onWheel(e: WheelEvent) {
      // Lightbox 打开时禁用（body 被锁滚 overflow:hidden 时跳过）
      if (document.body.style.overflow === 'hidden') return;
      const now = performance.now();
      if (animating || now < cooldownUntil) {
        e.preventDefault();
        return;
      }

      const about = document.getElementById('about');
      const works = document.getElementById('works-index');
      if (!about || !works) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const aboutBot = about.offsetTop + about.offsetHeight;
      const worksTop = works.offsetTop;

      // 关键边界线：
      //   snapLineDown = scrollY 等于这值时，About 底端正好贴 viewport 底（即"再往下就要看到 Works"）
      //   worksTop     = scrollY 等于这值时，Works 顶端正好贴 viewport 顶
      const snapLineDown = aboutBot - viewportH;

      // 预测本次 wheel 之后的滚动位置 —— 用它判断"会不会越界"
      const projectedY = scrollY + e.deltaY;

      const triggerSnap = (target: number) => {
        animating = true;
        accumulated = 0;
        smoothScrollTo(target, SCROLL_DURATION).then(() => {
          animating = false;
          cooldownUntil = performance.now() + COOLDOWN;
        });
      };

      const accumulate = () => {
        if (now - lastWheelTime > ACCUM_WINDOW) accumulated = 0;
        lastWheelTime = now;
        accumulated += Math.abs(e.deltaY);
      };

      // ── 向下：About → Works ──────────────────────────────
      //   条件：方向向下 + 本次滚动会让 scrollY 超过 snapLineDown（含已经在 gap 里的情况）
      //   且尚未深入 Works (scrollY < worksTop - tol)
      if (dir === 1 && projectedY > snapLineDown - BOUNDARY_TOL && scrollY < worksTop - BOUNDARY_TOL) {
        e.preventDefault();
        // 如果已经因为之前的原生滚动溢出到 gap 里，立刻钳回边界线，杜绝 WORK 偷露头
        if (scrollY > snapLineDown) instantScrollTo(snapLineDown);
        accumulate();
        if (accumulated >= SNAP_THRESHOLD) triggerSnap(worksTop);
        return;
      }

      // ── 向上：Works → About ──────────────────────────────
      //   条件：方向向上 + 本次滚动会让 scrollY 低于 worksTop（含 gap 里）
      //   且未深入 About (scrollY > snapLineDown + tol)
      if (dir === -1 && projectedY < worksTop + BOUNDARY_TOL && scrollY > snapLineDown + BOUNDARY_TOL) {
        e.preventDefault();
        if (scrollY < worksTop) instantScrollTo(worksTop);
        accumulate();
        if (accumulated >= SNAP_THRESHOLD) triggerSnap(snapLineDown);
        return;
      }

      // 不在 About↔Works 边界附近 → 原生滚动，重置累计
      accumulated = 0;
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return null;
}
