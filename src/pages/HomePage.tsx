import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { sitePaths } from '../app/routes';
import { Preloader } from '../components/Preloader';
import { SelectedGames } from '../sections/home/SelectedGames';
import { SupportingSections } from '../sections/home/SupportingSections';

const revealEase = [0.22, 1, 0.36, 1] as const;

export function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Preloader />
      <div className="portfolio-home">
        <section className="portfolio-hero" aria-labelledby="home-title">
          <div className="portfolio-hero__ledger">
            <span>朱翊嘉 / ZHU YIJIA</span>
            <span>游戏设计 / GAME DESIGN</span>
            <span>技术美术 / TECHNICAL ART</span>
            <span>作品集 / 2026</span>
          </div>

          <div className="portfolio-hero__body">
            <motion.p
              className="portfolio-hero__eyebrow"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: revealEase }}
            >
              GAME DESIGNER · SYSTEMS · REAL-TIME
            </motion.p>

            <h1 id="home-title" className="portfolio-hero__title">
              <span className="portfolio-hero__title-line">
                <motion.span
                  initial={reduceMotion ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.78, delay: 0.06, ease: revealEase }}
                >游戏</motion.span>
              </span>
              <span className="portfolio-hero__title-line portfolio-hero__title-line--offset">
                <motion.span
                  initial={reduceMotion ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.78, delay: 0.14, ease: revealEase }}
                >设计师</motion.span>
              </span>
            </h1>

            <motion.div
              className="portfolio-hero__statement"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.42, ease: revealEase }}
            >
              <p>专注玩法系统、交互体验与实时世界</p>
              <span>以原型、程序与技术美术，让设计成为可以操作和验证的体验。</span>
            </motion.div>
          </div>

          <div className="portfolio-hero__footer">
            <div className="portfolio-hero__disciplines" aria-label="能力方向">
              <span>玩法系统</span>
              <span>交互原型</span>
              <span>实时视觉</span>
            </div>
            <a className="portfolio-hero__next" href="#selected-games">
              <span>查看精选游戏</span>
              <b aria-hidden="true">↓</b>
            </a>
          </div>
        </section>

        <SelectedGames />
        <SupportingSections />

        <section className="portfolio-contact" id="contact" aria-labelledby="contact-title">
          <div className="portfolio-contact__index">
            <span>05</span>
            <span>ABOUT &amp; CONTACT</span>
          </div>
          <div className="portfolio-contact__body">
            <p>游戏设计是主方向；程序与技术美术，是把玩法落实到手感和画面的方法。</p>
            <h2 id="contact-title">如果你想讨论一个玩法，<br />欢迎直接联系我。</h2>
            <div className="portfolio-contact__links">
              <a href="mailto:1002520702@qq.com">1002520702@qq.com ↗</a>
              <Link to={sitePaths.about}>关于我</Link>
              <Link to={sitePaths.works}>全部作品</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
