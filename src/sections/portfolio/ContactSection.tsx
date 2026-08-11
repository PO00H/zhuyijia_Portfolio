import { ArrowUpRight, Mail } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

export function ContactSection() {
  return (
    <section id="contact" className="portfolio-section portfolio-contact-section">
      <SectionHeading
        index="08"
        eyebrow="Contact / 求职行动"
        title="LET'S BUILD"
        description="正在寻找 UE / C++ 游戏开发与 Gameplay Programmer 相关机会。"
      />

      <div className="portfolio-contact-panel">
        <a href="mailto:1002520702@qq.com" className="portfolio-contact-email">
          <span>
            <Mail aria-hidden="true" />
            EMAIL
          </span>
          <strong>1002520702@qq.com</strong>
          <ArrowUpRight aria-hidden="true" />
        </a>

        <div className="portfolio-contact-secondary">
          <div>
            <span>PHONE / WECHAT</span>
            <strong>13757722815</strong>
          </div>
          <div>
            <span>RESUME</span>
            <strong>文件待补</strong>
          </div>
          <div>
            <span>GITHUB / DEMO</span>
            <strong>链接待补</strong>
          </div>
        </div>
      </div>

      <footer className="portfolio-footer">
        <span>© 2026 ZHU YIJIA</span>
        <a href="#top">BACK TO TOP</a>
      </footer>
    </section>
  );
}
