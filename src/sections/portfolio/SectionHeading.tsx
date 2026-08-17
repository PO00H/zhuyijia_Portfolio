interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  variant?: 'default' | 'record' | 'catalog' | 'resume' | 'closing';
  meta?: {
    label: string;
    value: string;
  };
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  variant = 'default',
  meta,
}: SectionHeadingProps) {
  return (
    <header className={`portfolio-section-heading is-${variant}`}>
      <div className="portfolio-section-marker" aria-hidden="true">
        <span>{index}</span>
        <span className="portfolio-marker-line" />
      </div>
      <div className="portfolio-section-heading-copy">
        <p className="section-label">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="portfolio-section-description">{description}</p>}
      </div>
      {meta && (
        <div className="portfolio-section-heading-meta" aria-label={`${meta.label}，${meta.value}`}>
          <span>{meta.label}</span>
          <strong>{meta.value}</strong>
        </div>
      )}
    </header>
  );
}
