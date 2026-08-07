import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { getProjectPath, sitePaths } from '../app/routes';
import { Preloader } from '../components/Preloader';
import { getFeaturedProjects, type PortfolioProject } from '../data/projects';
import { SupportingSections } from '../sections/home/SupportingSections';

const revealEase = [0.22, 1, 0.36, 1] as const;
const nameCharacters = ['朱', '翊', '嘉'];

const storyCopy = {
  echoflash: {
    className: 'project-story--echo',
    category: '无引擎动作游戏',
    titleEn: 'ECHOFLASH',
    statement: '先听见，再出剑。',
    focus: '把“失明”从角色设定转化为操作限制：玩家通过声波辨位、判断距离，并在一次蓄力斩击中完成决策。',
    roles: '游戏设计 / 程序开发 / 像素美术',
    technology: 'C++17 / EasyX / 自研框架',
  },
  'erasers-odyssey': {
    className: 'project-story--eraser',
    category: '轻策略 Roguelike',
    titleEn: "ERASER'S ODYSSEY",
    statement: '让文具，成为一套会连锁反应的生态。',
    focus: '把文具的擦除、书写、收纳与组合关系转译为技能和资源循环，在三分钟内形成清晰的“收集—合成—战斗”节奏。',
    roles: '游戏设计 / 像素美术 / 原型开发',
    technology: 'Godot / Aseprite / Procreate',
  },
} as const;

interface ProjectStoryProps {
  index: number;
  project: PortfolioProject;
}

function ProjectStory({ index, project }: ProjectStoryProps) {
  const storyRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ['start end', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-28, 28]);
  const copy = storyCopy[project.slug as keyof typeof storyCopy];
  const projectHref = project.iframeUrl ?? getProjectPath(project.slug);

  if (!copy || !project.cover) return null;

  return (
    <motion.article
      ref={storyRef}
      className={`project-story ${copy.className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: revealEase }}
    >
      <header className="project-story__mast">
        <div className="project-story__rail" aria-label="项目信息">
          <span>0{index + 1}</span>
          <span>{project.year}</span>
          <span>个人作品</span>
        </div>
        <div className="project-story__title">
          <p className="eyebrow">{copy.category}</p>
          <h3>
            <span>{project.titleZh}</span>
            <small>{copy.titleEn}</small>
          </h3>
        </div>
      </header>

      <a
        className="project-story__media"
        href={projectHref}
        data-cursor="view"
        aria-label={`打开${project.titleZh ?? project.title}原项目网页`}
      >
        <motion.div className="project-story__media-shift" style={{ y: mediaY }}>
          <img
            src={project.cover}
            alt={`${project.titleZh ?? project.title}游戏封面`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </motion.div>
        <span className="project-story__open">打开原项目网页 ↗</span>
      </a>

      <div className="project-story__body">
        <p className="project-story__statement">{copy.statement}</p>
        <div className="project-story__details">
          <p>{copy.focus}</p>
          <dl>
            <div>
              <dt>个人职责</dt>
              <dd>{copy.roles}</dd>
            </div>
            <div>
              <dt>核心技术</dt>
              <dd>{copy.technology}</dd>
            </div>
            <div>
              <dt>展示形式</dt>
              <dd>原项目独立网页</dd>
            </div>
          </dl>
          <a className="text-link" href={projectHref} data-cursor="view">
            进入完整项目
          </a>
        </div>
      </div>
    </motion.article>
  );
}

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
              <span>中国 · 2026</span>
            </p>

            <h1 id="home-title" className="hero-title">
              <motion.span
                className="hero-title__characters"
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { delayChildren: 0.18, staggerChildren: 0.08 } },
                }}
              >
                {nameCharacters.map((character) => (
                  <motion.span
                    className="hero-title__character"
                    key={character}
                    variants={{
                      hidden: { opacity: 0, y: '0.45em' },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: revealEase } },
                    }}
                  >
                    {character}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                className="hero-title__role"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.48, ease: revealEase }}
              >
                游戏设计师
              </motion.span>
            </h1>

            <div className="hero-stage__bottom">
              <p>
                从玩法系统出发，以原型、程序与技术美术推进实现，
                <br />
                把一个游戏想法变成可以感知、可以验证的体验。
              </p>
              <div className="hero-stage__actions">
                <a className="text-link" href="#selected-games">查看精选游戏</a>
                <Link className="text-link text-link--muted" to={sitePaths.about}>了解我</Link>
              </div>
            </div>

            <p className="hero-stage__discipline">GAME DESIGN / SYSTEMS / PROTOTYPING</p>
          </div>
        </section>

        <section className="selected-games-v3" id="selected-games" aria-labelledby="selected-games-title">
          <motion.header
            className="selected-games-v3__heading"
            initial={reduceMotion ? false : { opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.8, ease: revealEase }}
          >
            <span className="section-number">01</span>
            <div>
              <p className="eyebrow">精选游戏 / SELECTED GAMES</p>
              <h2 id="selected-games-title">两种玩法命题，两套从零建立的游戏系统。</h2>
            </div>
          </motion.header>

          <div className="project-stories">
            {selectedGames.map((project, index) => (
              <ProjectStory index={index} key={project.id} project={project} />
            ))}
          </div>

          <Link className="text-link selected-games-v3__all" to={sitePaths.works}>
            浏览全部作品
          </Link>
        </section>

        <SupportingSections />

        <motion.section
          className="home-about"
          id="contact"
          aria-labelledby="home-about-title"
          initial={reduceMotion ? false : { opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.8, ease: revealEase }}
        >
          <span className="section-number">05</span>
          <div className="home-about__copy">
            <p className="eyebrow">关于与联系 / ABOUT &amp; CONTACT</p>
            <h2 id="home-about-title">
              我的主方向是游戏设计；程序与技术美术，是把玩法落到手感和画面上的方法。
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
