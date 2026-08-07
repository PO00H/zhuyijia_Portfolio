import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { getProjectPath, sitePaths } from '../app/routes';
import { Preloader } from '../components/Preloader';
import { getFeaturedProjects } from '../data/projects';

export function HomePage() {
  const selectedGames = getFeaturedProjects('selected-games');
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Preloader />
      <div className="home-page-v3">
        <section className="hero-stage" aria-labelledby="home-title">
          <div className="hero-stage__content">
            <p className="hero-stage__kicker">
              <span>个人作品集</span>
              <span>2026</span>
            </p>

            <h1 id="home-title" className="hero-title">
              <span className="hero-title__name">朱翊嘉</span>
              <span className="hero-title__role">游戏设计师</span>
            </h1>

            <div className="hero-stage__bottom">
              <p>
                以玩法系统为起点，通过原型、程序与技术美术，
                <br />
                把游戏想法推进为可感知、可验证的体验。
              </p>
              <div className="hero-stage__actions">
                <a className="text-link" href="#selected-games">查看精选游戏</a>
                <Link className="text-link text-link--muted" to={sitePaths.about}>了解我</Link>
              </div>
            </div>

            <p className="hero-stage__discipline">GAME DESIGN / SYSTEMS / PROTOTYPING</p>
          </div>
        </section>

        <motion.section
          className="selected-games-v3"
          id="selected-games"
          aria-labelledby="selected-games-title"
          initial={reduceMotion ? false : { opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="selected-games-v3__heading">
            <span className="section-number">01</span>
            <div>
              <p className="eyebrow">精选游戏 / SELECTED GAMES</p>
              <h2 id="selected-games-title">从玩法设计到完整实现的个人作品。</h2>
            </div>
          </header>

          <div className="featured-games">
            {selectedGames.map((project, index) => {
              const titleEn = project.slug === 'echoflash' ? 'ECHOFLASH' : "ERASER'S ODYSSEY";
              const rolesZh = project.slug === 'echoflash'
                ? '游戏设计 / 程序开发 / 像素美术'
                : '游戏设计 / 像素美术 / 原型开发';
              const projectHref = project.iframeUrl ?? getProjectPath(project.slug);

              return (
                <motion.article
                  className={`featured-game ${index % 2 === 1 ? 'featured-game--reverse' : ''}`}
                  key={project.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 72 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    className="featured-game__media"
                    href={projectHref}
                    aria-label={`打开${project.titleZh ?? project.title}原项目网页`}
                  >
                    <img
                      src={project.cover}
                      alt={`${project.titleZh ?? project.title}游戏封面`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                    <span className="featured-game__number">0{index + 1}</span>
                    <span className="featured-game__enter">打开项目 ↗</span>
                  </a>

                  <div className="featured-game__copy">
                    <p className="featured-game__meta">{project.year} / 个人作品</p>
                    <h3>
                      <span>{project.titleZh}</span>
                      <small>{titleEn}</small>
                    </h3>
                    <p className="featured-game__summary">{project.summary}</p>
                    <dl>
                      <div>
                        <dt>个人职责</dt>
                        <dd>{rolesZh}</dd>
                      </div>
                      <div>
                        <dt>形式</dt>
                        <dd>独立网页展示</dd>
                      </div>
                    </dl>
                    <a className="text-link" href={projectHref}>
                      打开原项目网页
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <Link className="text-link selected-games-v3__all" to={sitePaths.works}>
            浏览全部作品
          </Link>
        </motion.section>

        <motion.section
          className="home-about"
          id="contact"
          aria-labelledby="home-about-title"
          initial={reduceMotion ? false : { opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="section-number">02</span>
          <div className="home-about__copy">
            <p className="eyebrow">关于与联系 / ABOUT &amp; CONTACT</p>
            <h2 id="home-about-title">
              我以游戏设计为主要方向，技术美术与交互开发用于支持玩法落地。
            </h2>
            <div className="home-about__actions">
              <Link className="text-link" to={sitePaths.about}>查看完整介绍</Link>
              <a className="text-link text-link--muted" href="mailto:1002520702@qq.com">
                发送邮件
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
