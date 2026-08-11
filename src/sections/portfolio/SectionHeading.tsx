interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="portfolio-section-heading">
      <div className="portfolio-section-marker" aria-hidden="true">
        <span>{index}</span>
        <span className="portfolio-marker-line" />
      </div>
      <div className="portfolio-section-heading-copy">
        <p className="section-label">{eyebrow}</p>
        <h2>{title}</h2>
        {description && <p className="portfolio-section-description">{description}</p>}
      </div>
    </header>
  );
}
