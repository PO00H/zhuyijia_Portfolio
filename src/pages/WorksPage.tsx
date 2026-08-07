import { Link } from 'react-router-dom';

import { getProjectPath } from '../app/routes';
import { getPublicProjects } from '../data/projects';

export function WorksPage() {
  const projects = getPublicProjects();

  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">Archive / {projects.length.toString().padStart(2, '0')}</p>
        <h1>All Works</h1>
        <p>Games, interactive systems, technical art, and selected web work.</p>
      </header>

      <ol className="project-index" aria-label="Public projects">
        {projects.map((project, index) => (
          <li key={project.id}>
            <Link className="project-row" to={getProjectPath(project.slug)}>
              <span className="project-row__index">{(index + 1).toString().padStart(2, '0')}</span>
              <span className="project-row__title">{project.title}</span>
              <span className="project-row__meta">
                {project.primaryCategory.replace('-', ' ')} / {project.year}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
