export function AboutPage() {
  return (
    <div className="page-stack">
      <header className="page-intro">
        <p className="eyebrow">个人介绍 / 朱翊嘉</p>
        <h1>关于我</h1>
        <p>
          以游戏设计为主要方向，关注机制、交互与可玩原型；技术美术是支持玩法表达与验证的辅助能力。
        </p>
      </header>

      <section className="about-grid" aria-label="能力方向">
        <article>
          <p className="eyebrow">主要方向 / PRIMARY</p>
          <h2>游戏设计</h2>
          <p>玩法系统、机制设计、原型验证、迭代与玩家反馈。</p>
        </article>
        <article>
          <p className="eyebrow">辅助能力 / SUPPORTING</p>
          <h2>技术美术</h2>
          <p>通过视觉系统与技术实现，让玩法概念更容易被理解、测试和完善。</p>
        </article>
      </section>
    </div>
  );
}
