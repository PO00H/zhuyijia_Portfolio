import { NavLink } from 'react-router-dom';

import { siteNavigation } from '../../app/routes';

export function SiteHeader() {
  return (
    <header className="site-header">
      <NavLink className="site-identity" to="/" aria-label="朱翊嘉首页">
        <span className="site-identity__cn">朱翊嘉</span>
        <span className="site-identity__en">ZHU YIJIA</span>
      </NavLink>

      <nav aria-label="主导航">
        <ul className="site-nav">
          {siteNavigation.map((item) => (
            <li key={item.to}>
              {item.to.includes('#') ? (
                <a className="site-nav__link" href={item.to}>
                  {item.label}
                </a>
              ) : (
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'site-nav__link is-active' : 'site-nav__link'
                  }
                  end={item.to === '/'}
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
