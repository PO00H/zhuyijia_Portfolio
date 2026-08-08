import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

import { profile } from '../data/profile';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { gsap } from '../lib/gsap';

function SectionTitle({ number, label, title }: { number: string; label: string; title: string }) {
  return <header className="archive-about__section-title"><span>{number} / {label}</span><h2>{title}</h2></header>;
}

export function AboutPage() {
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced) return;
    gsap.from(titleRef.current, {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1,
    });
    gsap.from(bioRef.current, {
      y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3,
    });
    gsap.from(timelineRef.current?.children || [], {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.5,
    });
  }, { scope: rootRef, dependencies: [reduced], revertOnUpdate: true });

  return (
    <article ref={rootRef} className="archive-about archive-paper-page">
      <header className="archive-about__intro">
        <div className="archive-about__identity">
          <span>PROFILE / ZHU YIJIA / 2026</span>
          <h1 ref={titleRef}>朱翊嘉</h1>
          <small>游戏设计师 / GAME DESIGNER</small>
        </div>
        <div ref={bioRef} className="archive-about__bio">
          <strong>设计玩法，也实现玩法。</strong>
          <p>我以游戏设计为主要方向，关注机制、交互、玩家反馈与可玩原型。程序和技术美术用于缩短想法与真实体验之间的距离。</p>
          <div><span>所在地</span><b>中国</b><span>状态</span><b>开放交流与机会</b></div>
        </div>
      </header>

      <div className="archive-about__body">
        <aside>
          <span>[CAPABILITIES]</span>
          <h2>能力不是软件清单，<br />而是解决问题的方式。</h2>
          <a href={`mailto:${profile.publicContact.email}`}>{profile.publicContact.email} ↗</a>
        </aside>

        <div ref={timelineRef} className="archive-about__timeline">
          <section>
            <SectionTitle number="01" label="CAPABILITIES" title="能力方向" />
            <div className="archive-about__capabilities">
              {profile.capabilities.map((item) => (
                <article key={item.index}><span>{item.index}</span><div><h3>{item.title}</h3><p>{item.detail}</p><small>{item.tools}</small></div></article>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle number="02" label="EXPERIENCE" title="实践经历" />
            <div className="archive-about__entries">
              {profile.experience.map((item) => (
                <article key={`${item.period}-${item.company}`}><span>{item.period}</span><div><h3>{item.company}</h3><strong>{item.role}</strong><p>{item.detail}</p></div></article>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle number="03" label="EDUCATION" title="教育经历" />
            <div className="archive-about__entries">
              {profile.education.map((item) => (
                <article key={`${item.period}-${item.program}`}><span>{item.period}</span><div><h3>{item.institution}</h3><strong>{item.program}</strong>{item.detail ? <p>{item.detail}</p> : null}</div></article>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle number="04" label="AWARDS" title="奖项" />
            <ol className="archive-about__awards">
              {profile.awards.map((award, index) => <li key={`${award.title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{award.title}</strong><small>{award.period}</small></li>)}
            </ol>
          </section>
        </div>
      </div>

      <section className="archive-about__contact" id="contact">
        <span>[05 / CONTACT]</span><div><p>如果你想进一步了解项目、讨论玩法或合作机会，可以直接发送邮件。</p><h2>保持联系。</h2><a href={`mailto:${profile.publicContact.email}`}>{profile.publicContact.email} ↗</a></div>
      </section>
    </article>
  );
}
