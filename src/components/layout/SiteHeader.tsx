import { NavLink } from 'react-router-dom';

import { siteNavigation } from '../../app/routes';

export function SiteHeader() {
  return (
    <header className="site-header">
      <NavLink className="site-identity" to="/" aria-label="Zhu Yijia home">
        <span>Zhu Yijia</span>
        <span className="site-identity__cn">朱翊嘉</span>
      </NavLink>

      <nav aria-label="Primary navigation">
        <ul className="site-nav">
          {siteNavigation.map((item) => (
            <li key={item.to}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'site-nav__link is-active' : 'site-nav__link'
                }
                end={item.to === '/'}
                to={item.to}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
