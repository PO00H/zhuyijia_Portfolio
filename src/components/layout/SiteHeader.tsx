import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { siteNavigation } from '../../app/routes';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <NavLink className="site-identity" to="/" aria-label="朱翊嘉首页" onClick={() => setMenuOpen(false)}>
        <span className="site-identity__cn">朱翊嘉</span>
        <span className="site-identity__en">ZHU YIJIA</span>
      </NavLink>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
        aria-controls="site-menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <b>{menuOpen ? '关闭' : '菜单'}</b>
      </button>

      <nav className={menuOpen ? 'site-navigation is-open' : 'site-navigation'} id="site-menu" aria-label="主导航">
        <div className="site-navigation__label" aria-hidden="true">
          <span>INDEX</span>
          <span>2026</span>
        </div>
        <ul className="site-nav">
          {siteNavigation.map((item, index) => (
            <li key={item.to}>
              <span className="site-nav__number">0{index + 1}</span>
              {item.to.includes('#') ? (
                <a className="site-nav__link" href={item.to} onClick={() => setMenuOpen(false)}>{item.label}</a>
              ) : (
                <NavLink
                  className={({ isActive }) => isActive ? 'site-nav__link is-active' : 'site-nav__link'}
                  end={item.to === '/'}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
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
