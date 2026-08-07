import { Link } from 'react-router-dom';

import { sitePaths } from '../../app/routes';

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div>
        <p className="eyebrow">Contact</p>
        <a className="site-footer__contact" href="mailto:1002520702@qq.com">
          1002520702@qq.com
        </a>
      </div>

      <div className="site-footer__meta">
        <Link to={sitePaths.legacy}>Previous site</Link>
        <span>© 2026 Zhu Yijia</span>
      </div>
    </footer>
  );
}
