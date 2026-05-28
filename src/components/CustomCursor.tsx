import { useEffect, useRef, useState } from 'react';

/**
 * 自定义鼠标光标
 * - 默认：8px 橙色小圆点（瞬时跟随）
 * - hover 带 data-cursor="view" 的元素时：60px 橙色圆圈 + "VIEW"
 * - **点击 VIEW 元素**：半径平滑缩到 0 消失（lightbox 打开过渡）
 * - lightbox 打开期间 (document.body 锁定滚动) 保持隐藏
 * - lightbox 关闭后恢复
 * - 鼠标位置在 iframe 上：让出原生光标 (elementsFromPoint 检测)
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  // 状态用 ref 维护，直接 DOM 写避免 React rerender
  const stateRef = useRef({
    variant: 'default' as 'default' | 'view',
    overIframe: false,
    hidden: true,           // 鼠标进入页面前隐藏
    shrunk: false,          // click view 后缩到 0 / lightbox 打开期间
  });

  // 检测是否触屏
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(pointer: coarse)');
    setIsTouch(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const el = cursorRef.current;
    if (!el) return;

    // 渲染当前 state 到 DOM（手动控制 transform/size/opacity，不走 React state）
    const applyState = () => {
      const { variant, overIframe, hidden, shrunk } = stateRef.current;
      const showCustom = !hidden && !overIframe && !shrunk;
      el.style.opacity = showCustom ? '1' : '0';
      // shrunk 时强制 width=height=0 (覆盖 variant 的 size)
      const size = shrunk ? 0 : (variant === 'view' ? 64 : 8);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.dataset.variant = variant;
      // 让出原生光标
      document.documentElement.style.cursor = overIframe ? 'auto' : 'none';
    };

    // ── 鼠标位置同步 ──
    let lastIframeCheck = 0;
    const onMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      if (stateRef.current.hidden) {
        stateRef.current.hidden = false;
        applyState();
      }
      // 节流 elementsFromPoint，让光标在 iframe 上时让出
      const now = performance.now();
      if (now - lastIframeCheck > 60) {
        lastIframeCheck = now;
        const els = document.elementsFromPoint(e.clientX, e.clientY);
        const hasIframe = els.some((n) => (n as HTMLElement).tagName === 'IFRAME');
        if (hasIframe !== stateRef.current.overIframe) {
          stateRef.current.overIframe = hasIframe;
          applyState();
        }
      }
    };

    // ── variant 切换（hover 检测）──
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const newVariant = t.closest('[data-cursor="view"]') ? 'view' : 'default';
      if (newVariant !== stateRef.current.variant) {
        stateRef.current.variant = newVariant;
        applyState();
      }
    };

    // ── 点击 view 元素：触发"缩小到 0"动画 ──
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.closest('[data-cursor="view"]')) {
        stateRef.current.shrunk = true;
        applyState();
        // 此时 lightbox 即将打开 (body 会被锁滚)，monitor body 检测关闭后恢复
      }
    };

    const onLeave = () => {
      stateRef.current.hidden = true;
      applyState();
    };
    const onBlur = () => {
      stateRef.current.overIframe = true;
      applyState();
    };
    const onFocus = () => {
      stateRef.current.overIframe = false;
      applyState();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mousedown', onMouseDown, true);  // capture，先于 lightbox 自己的 click
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    // ── MutationObserver 监听 body 锁滚状态：lightbox 打开会设 overflow:hidden ──
    // overflow 一旦恢复 '' → lightbox 关闭 → reset shrunk
    const bodyObserver = new MutationObserver(() => {
      const locked = document.body.style.overflow === 'hidden';
      if (!locked && stateRef.current.shrunk) {
        stateRef.current.shrunk = false;
        applyState();
      }
    });
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
    });

    applyState();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onMouseDown, true);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      bodyObserver.disconnect();
      document.documentElement.style.cursor = '';
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          html, body, * { cursor: inherit; }
          iframe { cursor: auto !important; }
        }
      `}</style>
      <div
        ref={cursorRef}
        data-variant="default"
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#FF3D00]
                   flex items-center justify-center
                   transition-[width,height,opacity] duration-300 ease-out"
        style={{ opacity: 0, width: 8, height: 8 }}
      >
        <span
          className="text-[10px] font-mono tracking-widest text-white select-none opacity-0
                     transition-opacity duration-200 whitespace-nowrap"
        >
          VIEW
        </span>
      </div>
      <style>{`
        [data-variant="view"] > span { opacity: 1 !important; }
        [data-variant="default"] > span { opacity: 0 !important; }
      `}</style>
    </>
  );
}
