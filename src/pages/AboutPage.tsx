import { motion, useReducedMotion } from 'framer-motion';

import { profile } from '../data/profile';

const revealEase = [0.22, 1, 0.36, 1] as const;

export function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <article className="about-archive">
      <header className="about-archive__hero">
        <div className="about-archive__ledger">
          <span>PROFILE / ZHU YIJIA</span>
          <span>GAME DESIGNER</span>
          <span>2026</span>
        </div>
        <p>关于我</p>
        <h1>设计玩法，<br />也实现玩法。</h1>
        <div className="about-archive__statement">
          <strong>游戏设计是我的主要方向。</strong>
          <p>我关注机制、交互、玩家反馈与可玩原型；程序和技术美术用于缩短想法与真实体验之间的距离。</p>
        </div>
      </header>

      <section className="about-capabilities" aria-labelledby="about-capabilities-title">
        <div className="about-section-title">
          <span>01 / CAPABILITIES</span>
          <h2 id="about-capabilities-title">能力不是软件清单，<br />而是解决问题的方式。</h2>
        </div>
        <div className="about-capabilities__grid">
          {profile.capabilities.map((capability) => (
            <motion.article
              key={capability.index}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: reduceMotion ? 0 : 0.6, ease: revealEase }}
            >
              <span>{capability.index}</span>
              <h3>{capability.title}</h3>
              <p>{capability.detail}</p>
              <small>{capability.tools}</small>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about-timeline" aria-labelledby="experience-title">
        <div className="about-section-title">
          <span>02 / EXPERIENCE</span>
          <h2 id="experience-title">经历</h2>
        </div>
        <ol>
          {profile.experience.map((item, index) => (
            <motion.li
              key={`${item.period}-${item.company}`}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, delay: index * 0.04, ease: revealEase }}
            >
              <span>{item.period}</span>
              <div>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
              </div>
              <p>{item.detail}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="about-education" aria-labelledby="education-title">
        <div className="about-section-title">
          <span>03 / EDUCATION</span>
          <h2 id="education-title">教育</h2>
        </div>
        <div className="about-education__grid">
          {profile.education.map((item) => (
            <article key={`${item.period}-${item.program}`}>
              <span>{item.period}</span>
              <h3>{item.institution}</h3>
              <strong>{item.program}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="about-awards" aria-labelledby="awards-title">
        <div className="about-section-title">
          <span>04 / AWARDS</span>
          <h2 id="awards-title">奖项</h2>
        </div>
        <ol>
          {profile.awards.map((award, index) => (
            <li key={`${award.title}-${index}`}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{award.title}</strong>
              <small>{award.period}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-contact" id="contact" aria-labelledby="about-contact-title">
        <span>05 / CONTACT</span>
        <div>
          <p>如果你想进一步了解项目、讨论玩法或合作机会，可以直接发送邮件。</p>
          <h2 id="about-contact-title">保持联系。</h2>
          <a href={`mailto:${profile.publicContact.email}`}>{profile.publicContact.email} ↗</a>
        </div>
      </section>
    </article>
  );
}
