import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';

import { gsap } from '../../lib/gsap';

const INTRO_SESSION_KEY = 'portfolio_intro_seen_v5';
const INTRO_COMPLETE_EVENT = 'portfolio:intro-complete';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const firstTitleRef = useRef<HTMLSpanElement>(null);
  const secondTitleRef = useRef<HTMLSpanElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const [introReady, setIntroReady] = useState(() => (
    typeof window === 'undefined' || sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  ));

  useEffect(() => {
    if (introReady) return;
    const completeIntro = () => setIntroReady(true);
    window.addEventListener('portfolio:intro-complete', completeIntro);
    return () => window.removeEventListener(INTRO_COMPLETE_EVENT, completeIntro);
  }, [introReady]);

  useGSAP(() => {
    const titles = [firstTitleRef.current, secondTitleRef.current];
    const supporting = [metaRef.current, tagsRef.current, footRef.current];
    if (!introReady) {
      gsap.set(titles, { clipPath: 'inset(100% 0% 0% 0%)', y: 40 });
      gsap.set(supporting, { opacity: 0, y: 20 });
      return;
    }

    gsap.set(titles, { clipPath: 'inset(100% 0% 0% 0%)', y: 40 });
    gsap.set(supporting, { opacity: 0, y: 20 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(metaRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
      .to(firstTitleRef.current, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1 }, 0.4)
      .to(secondTitleRef.current, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1 }, 0.55)
      .to(tagsRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.9)
      .to(footRef.current, { opacity: 1, y: 0, duration: 0.8 }, 1.1);

    gsap.to(titles, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: rootRef, dependencies: [introReady], revertOnUpdate: true });

  return (
    <section ref={rootRef} className="archive-hero" aria-labelledby="archive-home-title">
      <div ref={metaRef} className="archive-hero__ledger">
        <div><small>姓名 / NAME</small><span>朱翊嘉 / ZHU YIJIA</span></div>
        <div><small>主方向 / ROLE</small><span>游戏设计师</span></div>
        <div><small>实践 / PRACTICE</small><span>玩法系统 / 技术美术</span></div>
        <div><small>作品集 / ARCHIVE</small><span>2026 / 中国</span></div>
      </div>

      <div className="archive-hero__body">
        <p>GAME DESIGN · SYSTEMS · REAL-TIME</p>
        <h1 id="archive-home-title">
          <span ref={firstTitleRef}>游戏设计师</span>
          <span ref={secondTitleRef}>技术美术</span>
        </h1>
        <div ref={tagsRef} className="archive-hero__tags" aria-label="能力方向">
          <span>玩法设计</span><span>交互原型</span><span>实时视觉</span>
        </div>
      </div>

      <div ref={footRef} className="archive-hero__foot">
        <span className="archive-hero__ghost">01</span>
        <p>以原型、程序与技术美术，把玩法想法变成可操作、可验证的体验。</p>
        <a href="#selected-games"><i />精选游戏 ↓</a>
      </div>
    </section>
  );
}
