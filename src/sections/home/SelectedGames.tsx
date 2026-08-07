import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, type CSSProperties, type PointerEvent } from 'react';

import { getFeaturedProjects, type PortfolioProject } from '../../data/projects';

const selectedGameCopy: Record<string, {
  category: string;
  titleEn: string;
  focus: string;
  roles: string;
}> = {
  echoflash: {
    category: '无引擎动作游戏',
    titleEn: 'ECHOFLASH',
    focus: '声波辨位 / 蓄力斩击 / 战斗反馈',
    roles: '游戏设计 / 程序 / 像素美术',
  },
  'erasers-odyssey': {
    category: '轻策略 Roguelike',
    titleEn: "ERASER'S ODYSSEY",
    focus: '收集 / 合成 / 战斗循环',
    roles: '游戏设计 / 原型 / 像素美术',
  },
};

function getOriginalPresentation(project: PortfolioProject): string {
  return project.iframeUrl ?? project.detailPath ?? `/works/${project.slug}`;
}

export function SelectedGames() {
  const games = getFeaturedProjects('selected-games');
  const reduceMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [pointer, setPointer] = useState({ x: 50, y: 46 });
  const activeProject = games.find((project) => project.slug === activeSlug);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const previewStyle = {
    '--preview-x': `${Math.min(72, Math.max(28, pointer.x))}%`,
    '--preview-y': `${Math.min(72, Math.max(28, pointer.y))}%`,
  } as CSSProperties;

  return (
    <section
      className="selected-games-directory"
      id="selected-games"
      aria-labelledby="selected-games-title"
    >
      <header className="editorial-heading editorial-heading--light">
        <div className="editorial-heading__index">
          <span>01</span>
          <span>SELECTED GAMES</span>
        </div>
        <div className="editorial-heading__copy">
          <p>精选游戏</p>
          <h2 id="selected-games-title">两个从玩法命题出发，独立完成的游戏。</h2>
        </div>
      </header>

      <div
        className="selected-games-directory__stage"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveSlug(null)}
      >
        <AnimatePresence>
          {activeProject?.cover ? (
            <motion.figure
              className="selected-games-directory__preview"
              key={activeProject.id}
              style={previewStyle}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            >
              <img src={activeProject.cover} alt="" />
              <span>VIEW</span>
            </motion.figure>
          ) : null}
        </AnimatePresence>

        <ol className={activeSlug ? 'selected-games-list has-active-item' : 'selected-games-list'}>
          {games.map((project, index) => {
            const copy = selectedGameCopy[project.slug];
            if (!copy) return null;

            return (
              <li key={project.id}>
                <a
                  className={activeSlug === project.slug ? 'selected-game-row is-active' : 'selected-game-row'}
                  data-selected-game={project.slug}
                  data-cursor="view"
                  href={getOriginalPresentation(project)}
                  onMouseEnter={() => setActiveSlug(project.slug)}
                  onFocus={() => setActiveSlug(project.slug)}
                  onBlur={() => setActiveSlug(null)}
                  aria-label={`打开${project.titleZh ?? project.title}原项目网页`}
                >
                  <span className="selected-game-row__number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="selected-game-row__identity">
                    <span className="selected-game-row__title">{project.titleZh ?? project.title}</span>
                    <span className="selected-game-row__title-en">{copy.titleEn}</span>
                  </span>
                  <span className="selected-game-row__meta">
                    <span>{project.year} / {copy.category}</span>
                    <span>{copy.roles}</span>
                    <span>{copy.focus}</span>
                  </span>
                  {project.cover ? (
                    <span className="selected-game-row__mobile-media" aria-hidden="true">
                      <img src={project.cover} alt="" loading="lazy" />
                    </span>
                  ) : null}
                  <span className="selected-game-row__action">查看项目 ↗</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
