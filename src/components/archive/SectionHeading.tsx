import { Reveal } from '../motion/Reveal';

interface SectionHeadingProps {
  number: string;
  label: string;
  title: string;
  eyebrow: string;
  dark?: boolean;
  id?: string;
}

export function SectionHeading({ number, label, title, eyebrow, dark = false, id }: SectionHeadingProps) {
  return (
    <Reveal className={dark ? 'archive-section-heading is-dark' : 'archive-section-heading'}>
      <div className="archive-section-heading__index"><span>{number}</span><small>[{label}]</small></div>
      <div className="archive-section-heading__copy">
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
    </Reveal>
  );
}
