import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navigationItems = [
  { href: '#game-work', label: 'Game Work' },
  { href: '#systems', label: 'Systems' },
  { href: '#experience', label: 'Experience' },
  { href: '#archive', label: 'Archive' },
  { href: '#contact', label: 'Contact' },
];

export function PortfolioNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    firstMobileLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      toggleRef.current?.focus();
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    const desktopQuery = window.matchMedia('(min-width: 721px)');
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    desktopQuery.addEventListener('change', handleDesktopChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
      desktopQuery.removeEventListener('change', handleDesktopChange);
    };
  }, [isMenuOpen]);

  return (
    <nav ref={navigationRef} className="portfolio-navigation" aria-label="主导航">
      <a className="portfolio-navigation-brand" href="#top" aria-label="返回首页顶部">
        <span>ZHU YIJIA</span>
        <small>UE / C++</small>
      </a>

      <div className="portfolio-navigation-links">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      <button
        ref={toggleRef}
        className="portfolio-navigation-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="portfolio-mobile-menu"
        aria-label={isMenuOpen ? '关闭主导航菜单' : '打开主导航菜单'}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span>{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        id="portfolio-mobile-menu"
        className="portfolio-navigation-mobile-menu"
        hidden={!isMenuOpen}
      >
        {navigationItems.map((item, index) => (
          <a
            key={item.href}
            ref={index === 0 ? firstMobileLinkRef : undefined}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            <small>{(index + 1).toString().padStart(2, '0')}</small>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
