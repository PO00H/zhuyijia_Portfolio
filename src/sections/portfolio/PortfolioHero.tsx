import { ResumeDownload } from '@/components/resume/ResumeDownload';

export function PortfolioHero() {
  return (
    <section id="top" className="portfolio-hero" aria-labelledby="hero-title">
      <div className="portfolio-hero-main">
        <div className="portfolio-hero-identity">
          <p className="portfolio-hero-meta">PORTFOLIO / 2026</p>
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
            <ResumeDownload variant="hero" />
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
