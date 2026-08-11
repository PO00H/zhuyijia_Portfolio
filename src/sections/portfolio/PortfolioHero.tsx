export function PortfolioHero() {
  return (
    <section id="top" className="portfolio-hero" aria-labelledby="hero-title">
      <div className="portfolio-hero-meta">
        <span>PORTFOLIO / 2026</span>
        <span>BEIJING · WENZHOU</span>
      </div>

      <div className="portfolio-hero-main">
        <p className="section-label">ZHU YIJIA · 朱翊嘉</p>
        <h1 id="hero-title">
          <span>UE / C++</span>
          <span>GAME DEVELOPER</span>
        </h1>
        <div className="portfolio-hero-statement">
          <p>
            使用 Unreal Engine 与 C++ 构建玩法系统、交互原型和生产工具。
            理解动画、技术美术与资产管线，能够跨越代码与最终表现完成落地。
          </p>
          <div className="portfolio-hero-actions">
            <a className="portfolio-primary-action" href="#game-work">
              查看核心项目
            </a>
            <span className="portfolio-secondary-action" aria-disabled="true">
              RESUME · 文件待补
            </span>
          </div>
        </div>
      </div>

      <div className="portfolio-hero-capabilities" aria-label="核心能力">
        <span>C++</span>
        <span>Unreal Engine</span>
        <span>Gameplay Systems</span>
        <span>Tools Development</span>
      </div>
    </section>
  );
}
