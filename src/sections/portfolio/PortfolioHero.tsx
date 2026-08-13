export function PortfolioHero() {
  return (
    <section id="top" className="portfolio-hero" aria-labelledby="hero-title">
      <div className="portfolio-hero-meta">
        <span>PORTFOLIO / 2026</span>
      </div>

      <div className="portfolio-hero-main">
        <div className="portfolio-hero-identity">
          <p className="section-label">ZHU YIJIA · 朱翊嘉</p>
          <h1 id="hero-title">
            <span>UE / C++</span>
            <span>游戏开发</span>
          </h1>
        </div>
        <div className="portfolio-hero-statement">
          <p>
            使用 Unreal Engine 与 C++ 构建玩法系统、交互原型和生产工具。
            理解动画、技术美术与资产管线，能够跨越代码与最终表现完成落地。
          </p>
          <div className="portfolio-hero-actions">
            <a className="portfolio-primary-action" href="#game-work">
              查看核心项目
            </a>
            <a
              className="portfolio-secondary-action"
              href="/documents/朱翊嘉个人简历.pdf"
              download="朱翊嘉个人简历.pdf"
            >
              下载个人简历
            </a>
          </div>
        </div>
      </div>

      <div className="portfolio-hero-capabilities" aria-label="核心能力">
        <span>C++</span>
        <span>Unreal Engine</span>
        <span>玩法系统</span>
        <span>工具开发</span>
      </div>
    </section>
  );
}
