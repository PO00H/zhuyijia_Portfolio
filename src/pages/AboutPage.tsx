export function AboutPage() {
  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">Profile / 朱翊嘉</p>
        <h1>About</h1>
        <p>
          Game Designer focused on mechanics, interaction, and playable prototypes, with technical art as a supporting practice.
        </p>
      </header>

      <section className="about-grid" aria-label="Design profile">
        <article>
          <p className="eyebrow">Primary</p>
          <h2>Game Design</h2>
          <p>Systems, mechanics, prototyping, iteration, and player feedback.</p>
        </article>
        <article>
          <p className="eyebrow">Supporting</p>
          <h2>Technical Art</h2>
          <p>Visual systems and implementation that make gameplay ideas easier to read and test.</p>
        </article>
      </section>
    </div>
  );
}
