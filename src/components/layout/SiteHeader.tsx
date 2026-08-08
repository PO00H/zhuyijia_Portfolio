import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { siteNavigation } from '../../app/routes';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { gsap } from '../../lib/gsap';

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!menuOpen) return;

    const menu = menuRef.current;
    const main = document.getElementById('main-content');
    const footer = document.getElementById('site-footer');
    const toggle = toggleRef.current;
    const focusables = () => Array.from(menu?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    const closeMenu = () => setMenuOpen(false);
    const manageKeyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add('archive-menu-open');
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    document.addEventListener('keydown', manageKeyboard);
    window.requestAnimationFrame(() => focusables()[0]?.focus());

    return () => {
      document.removeEventListener('keydown', manageKeyboard);
      document.body.classList.remove('archive-menu-open');
      if (main) main.inert = false;
      if (footer) footer.inert = false;
      toggle?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    if (reduced) {
      gsap.set(header, { yPercent: 0 });
      return () => gsap.killTweensOf(header);
    }

    if (menuOpen) {
      gsap.to(header, { yPercent: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      return () => gsap.killTweensOf(header);
    }

    let previousY = window.scrollY;
    let hidden = false;
    const sync = () => {
      const nextY = window.scrollY;
      const shouldHide = nextY > 100 && nextY > previousY;
      previousY = nextY;
      if (shouldHide === hidden) return;
      hidden = shouldHide;
      gsap.to(header, {
        yPercent: shouldHide ? -100 : 0,
        duration: 0.4,
        ease: shouldHide ? 'power2.inOut' : 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', sync, { passive: true });
    return () => {
      window.removeEventListener('scroll', sync);
      gsap.killTweensOf(header);
    };
  }, [menuOpen, reduced]);

  return (
    <>
      <header ref={headerRef} className="archive-header" data-archive-navigation="true">
        <div className="archive-header__inner">
          <NavLink className="archive-brand" to="/" aria-label="朱翊嘉首页">
            <span>朱翊嘉</span><small>ZHU YIJIA</small>
          </NavLink>

          <nav className="archive-nav archive-nav--desktop" aria-label="主导航">
            {siteNavigation.map((item, index) => item.to.includes('#') ? (
              <a key={item.to} href={item.to} data-cursor="read">
                <small>0{index + 1}</small>{item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} data-cursor="read">
                <small>0{index + 1}</small>{item.label}
              </NavLink>
            ))}
          </nav>

          <button
            ref={toggleRef}
            className={menuOpen ? 'archive-menu-toggle is-open' : 'archive-menu-toggle'}
            type="button"
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-controls="archive-mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><b>{menuOpen ? '关闭' : '菜单'}</b>
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="archive-mobile-menu"
        className={menuOpen ? 'archive-mobile-menu is-open' : 'archive-mobile-menu'}
        role="dialog"
        aria-modal={menuOpen ? 'true' : undefined}
        aria-label="移动端导航菜单"
        aria-hidden={!menuOpen}
      >
        <span className="archive-mobile-menu__index">INDEX / {new Date().getFullYear()}</span>
        <nav aria-label="移动端主导航">
          {siteNavigation.map((item, index) => item.to.includes('#') ? (
            <a key={item.to} href={item.to} onClick={() => setMenuOpen(false)}>
              <small>0{index + 1}</small><span>{item.label}</span>
            </a>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMenuOpen(false)}>
              <small>0{index + 1}</small><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}
