import { Link } from 'react-router-dom';

import { sitePaths } from '../../app/routes';

export function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <div>
        <p className="eyebrow">联系 / CONTACT</p>
        <a className="site-footer__contact" href="mailto:1002520702@qq.com">
          1002520702@qq.com
        </a>
      </div>

      <div className="site-footer__meta">
        <Link to={sitePaths.legacy}>查看旧版作品集</Link>
        <span>© 2026 朱翊嘉</span>
      </div>
    </footer>
  );
}
