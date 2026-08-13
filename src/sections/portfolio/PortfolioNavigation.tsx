import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const navigationItems = [
  { href: '#game-work', label: '核心游戏', number: '02', section: 'game-work' },
  { href: '#systems', label: 'UE 实验', number: '03', section: 'systems' },
  { href: '#experience', label: '实习经历', number: '04', section: 'experience' },
  { href: '#relevant-work', label: '辅助能力', number: '05', section: 'relevant-work' },
  { href: '#archive', label: '作品档案', number: '06', section: 'archive' },
  { href: '#profile', label: '个人履历', number: '07', section: 'profile' },
  { href: '#contact', label: '联系', number: '08', section: 'contact' },
];

const observedSections = [
  { id: 'top', number: '01' },
  { id: 'game-work', number: '02' },
  { id: 'systems', number: '03' },
  { id: 'experience', number: '04' },
  { id: 'relevant-work', number: '05' },
  { id: 'archive', number: '06' },
  { id: 'profile', number: '07' },
  { id: 'contact', number: '08' },
];

export function PortfolioNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(() => {
    const hashSection = window.location.hash.slice(1);
    return observedSections.some(({ id }) => id === hashSection) ? hashSection : 'top';
  });
  const navigationRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = observedSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              observedSections.findIndex(({ id }) => id === first.target.id) -
              observedSections.findIndex(({ id }) => id === second.target.id),
          )[0];

        if (current) {
          setActiveSectionId((activeId) =>
            activeId === current.target.id ? activeId : current.target.id,
          );
        }
      },
      { rootMargin: '-44% 0px -54% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

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

  useEffect(() => {
    const shell = navigationRef.current?.closest<HTMLElement>('.portfolio-shell');
    if (!shell) return;

    shell.dataset.activeSection = activeSectionId;
    return () => {
      delete shell.dataset.activeSection;
    };
  }, [activeSectionId]);

  const activeSectionNumber =
    observedSections.find(({ id }) => id === activeSectionId)?.number ?? '01';
  const isHeroActive = activeSectionId === 'top';

  return (
    <nav ref={navigationRef} className="portfolio-navigation" aria-label="主导航">
      <a
        className={`portfolio-navigation-brand ${isHeroActive ? 'is-current' : ''}`}
        href="#top"
        aria-label="返回首页顶部"
        aria-current={isHeroActive ? 'location' : undefined}
      >
        <span>ZHU YIJIA</span>
        <small>UE / C++</small>
      </a>

      <div className="portfolio-navigation-links">
        {navigationItems.map((item) => {
          const isCurrent = item.section === activeSectionId;

          return (
            <a
              key={item.href}
              href={item.href}
              className={isCurrent ? 'is-current' : undefined}
              aria-current={isCurrent ? 'location' : undefined}
            >
              {item.label}
            </a>
          );
        })}
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
        <span>{activeSectionNumber} / {isMenuOpen ? '关闭' : '目录'}</span>
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        id="portfolio-mobile-menu"
        className="portfolio-navigation-mobile-menu"
        hidden={!isMenuOpen}
      >
        {navigationItems.map((item) => {
          const isCurrent = item.section === activeSectionId;

          return (
            <a
              key={item.href}
              href={item.href}
              className={isCurrent ? 'is-current' : undefined}
              aria-current={isCurrent ? 'location' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              <small>{item.number}</small>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
