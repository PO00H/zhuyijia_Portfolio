import { Link, useParams } from 'react-router-dom';

import { sitePaths } from '../app/routes';
import { getPublicProjects } from '../data/projects';

export function ProjectPage() {
  const { slug } = useParams();
  const project = getPublicProjects().find((candidate) => candidate.slug === slug);

  if (!project) {
    return (
      <div className="page-stack">
        <header className="page-intro">
          <p className="eyebrow">404 / Work</p>
          <h1>Project not found</h1>
          <Link className="text-link" to={sitePaths.works}>Return to all works</Link>
        </header>
      </div>
    );
  }

  const ownershipLabel = project.ownership === 'personal' ? 'Personal Project' : 'Team Project';

  return (
    <article className="page-stack project-page">
      <header className="page-intro project-page__intro">
        <p className="eyebrow">{project.year} / {ownershipLabel}</p>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </header>

      <dl className="project-facts">
        <div>
          <dt>Role</dt>
          <dd>{project.roles.join(' / ')}</dd>
        </div>
        <div>
          <dt>Discipline</dt>
          <dd>{project.disciplines.join(' / ')}</dd>
        </div>
        <div>
          <dt>Tools</dt>
          <dd>{project.tools.join(' / ')}</dd>
        </div>
      </dl>

      <Link className="text-link" to={sitePaths.works}>Back to all works</Link>
    </article>
  );
}
