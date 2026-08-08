import { Link } from 'react-router-dom';

import { sitePaths } from '../../app/routes';

export function SiteFooter() {
  return (
    <footer className="archive-footer" id="site-footer">
      <span>© 朱翊嘉 {new Date().getFullYear()}</span>
      <nav aria-label="页脚导航">
        <Link to={sitePaths.works}>全部作品</Link>
        <Link to={sitePaths.about}>关于</Link>
        <a href="mailto:1002520702@qq.com">邮箱</a>
      </nav>
    </footer>
  );
}
