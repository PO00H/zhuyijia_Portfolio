import { useCallback, useEffect, useState } from 'react';

import { preloaderCopy } from './preloaderSequence';

const SESSION_KEY = 'portfolio_intro_seen_v5';
const DISPLAY_DURATION = 820;
const EXIT_DURATION = 380;

export function Preloader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [exiting, setExiting] = useState(false);

  const finish = useCallback(() => {
    if (!visible || exiting) return;
    setExiting(true);
  }, [exiting, visible]);

  useEffect(() => {
    if (!visible) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(finish, reduced ? 120 : DISPLAY_DURATION);
    const skip = () => finish();
    window.addEventListener('wheel', skip, { passive: true, once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [finish, visible]);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1');
      setVisible(false);
    }, EXIT_DURATION);
    return () => window.clearTimeout(timer);
  }, [exiting]);

  if (!visible) return null;

  return (
    <button
      className={exiting ? 'portfolio-intro is-exiting' : 'portfolio-intro'}
      type="button"
      onClick={finish}
      aria-label="跳过片头"
    >
      <span className="portfolio-intro__index">00 / 05</span>
      <span className="portfolio-intro__name">{preloaderCopy.sequence[0]}</span>
      <span className="portfolio-intro__role">{preloaderCopy.sequence[1]}</span>
      <span className="portfolio-intro__meta">{preloaderCopy.loading} / {preloaderCopy.context}</span>
    </button>
  );
}
