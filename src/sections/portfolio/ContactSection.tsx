import { ArrowUpRight, Github, Mail, Phone } from 'lucide-react';
import { ResumeDownload } from '@/components/resume/ResumeDownload';
import { SectionHeading } from './SectionHeading';

export function ContactSection() {
  return (
    <section id="contact" className="portfolio-section portfolio-contact-section">
      <SectionHeading
        index="08"
        eyebrow="求职联系 / CONTACT"
        title="联系与投递"
        description="正在寻找 UE / C++ 游戏开发与 Gameplay Programmer 相关机会。"
        variant="closing"
      />

      <div className="portfolio-contact-panel">
        <div className="portfolio-contact-grid">
          <a
            href="mailto:1002520702@qq.com"
            className="portfolio-contact-card portfolio-contact-link portfolio-contact-email"
          >
            <span className="portfolio-contact-label">
              <Mail aria-hidden="true" />
              邮箱 / EMAIL
            </span>
            <strong>1002520702@qq.com</strong>
            <ArrowUpRight className="portfolio-contact-arrow" aria-hidden="true" />
          </a>

          <div className="portfolio-contact-card">
            <span className="portfolio-contact-label">
              <Phone aria-hidden="true" />
              电话 / 微信
            </span>
            <strong>13757722815</strong>
          </div>

          <ResumeDownload variant="contact" />

          <a
            href="https://github.com/PO00H"
            target="_blank"
            rel="noreferrer"
            className="portfolio-contact-card portfolio-contact-link"
          >
            <span className="portfolio-contact-label">
              <Github aria-hidden="true" />
              代码 / 演示
            </span>
            <strong>github.com/PO00H</strong>
            <ArrowUpRight className="portfolio-contact-arrow" aria-hidden="true" />
          </a>
        </div>
      </div>

      <footer className="portfolio-footer">
        <span>© 2026 ZHU YIJIA</span>
        <a href="#top">返回顶部</a>
      </footer>
    </section>
  );
}
