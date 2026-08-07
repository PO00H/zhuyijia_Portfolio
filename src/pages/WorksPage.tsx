import { Link } from 'react-router-dom';

import { getProjectPath } from '../app/routes';
import { getPublicProjects, type PrimaryCategory } from '../data/projects';

const categoryLabels: Record<PrimaryCategory, string> = {
  game: '游戏',
  'technical-art': '技术美术',
  tools: '工具与系统',
  web: '网页实验',
};

export function WorksPage() {
  const projects = getPublicProjects();

  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">作品档案 / {projects.length.toString().padStart(2, '0')}</p>
        <h1>全部作品</h1>
        <p>游戏、交互系统、技术美术，以及经过筛选的网页实验。</p>
      </header>

      <ol className="project-index" aria-label="公开项目">
        {projects.map((project, index) => (
          <li key={project.id}>
            <Link className="project-row" to={getProjectPath(project.slug)}>
              <span className="project-row__index">{(index + 1).toString().padStart(2, '0')}</span>
              <span className="project-row__title">{project.title}</span>
              <span className="project-row__meta">
                {categoryLabels[project.primaryCategory]} / {project.year}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
