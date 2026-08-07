import { Link } from 'react-router-dom';

import { getProjectPath, sitePaths } from '../app/routes';
import { getFeaturedProjects } from '../data/projects';

export function HomePage() {
  const selectedGames = getFeaturedProjects('selected-games');

  return (
    <div className="page-stack home-page">
      <section className="hero-shell" aria-labelledby="home-title">
        <p className="eyebrow">Portfolio / 2026</p>
        <h1 id="home-title">
          <span>Zhu Yijia</span>
          <strong>Game Designer</strong>
        </h1>
        <p className="hero-shell__summary">
          I design playable systems, prototype interaction, and use technical art to make game ideas legible.
        </p>
        <div className="hero-shell__actions">
          <a className="text-link" href="#selected-games">Selected games</a>
          <Link className="text-link text-link--muted" to={sitePaths.about}>About</Link>
        </div>
      </section>

      <section className="route-section" id="selected-games" aria-labelledby="selected-games-title">
        <div className="section-heading">
          <p className="eyebrow">Selected Games</p>
          <h2 id="selected-games-title">Personal work, built end to end.</h2>
        </div>

        <ol className="project-index project-index--featured">
          {selectedGames.map((project, index) => (
            <li key={project.id}>
              <Link className="project-row" to={getProjectPath(project.slug)}>
                <span className="project-row__index">0{index + 1}</span>
                <span className="project-row__title">{project.title}</span>
                <span className="project-row__meta">{project.year} / Personal</span>
              </Link>
            </li>
          ))}
        </ol>

        <Link className="text-link" to={sitePaths.works}>View all works</Link>
      </section>
    </div>
  );
}
