import { useEffect, useState } from 'react';

import { preloaderCopy } from './preloaderSequence';

const MIN_DURATION = 1500;
const MAX_DURATION = 6000;
const SESSION_KEY = 'preloader_shown_v4';

const TYPE_INTERVAL_EN = 55;
const TYPE_INTERVAL_CN = 110;
const WIPE_INTERVAL = 45;
const PAUSE_AFTER_TYPE = 220;
const PAUSE_AFTER_WIPE = 100;
const FINAL_HOLD = 500;
const EXIT_DURATION = 700;

const [TEXT_EN, TEXT_CN, TEXT_FINAL] = preloaderCopy.sequence;

type Phase =
  | 'counting'
  | 'type-en'
  | 'wipe-en'
  | 'type-cn'
  | 'wipe-cn'
  | 'type-final'
  | 'hold'
  | 'exit'
  | 'done';

export function Preloader() {
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (import.meta.env.DEV) return true;
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [phase, setPhase] = useState<Phase>('counting');
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!shouldShow || phase !== 'counting') return;
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let done = false;
    let timer: number | null = null;

    const checkAssets = () => {
      const images = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      const total = images.length + videos.length;
      if (total === 0) return { loaded: 0, total: 0 };

      let loaded = 0;
      images.forEach((image) => {
        if (image.complete && image.naturalHeight > 0) loaded += 1;
      });
      videos.forEach((video) => {
        if (video.readyState >= 2) loaded += 1;
      });
      return { loaded, total };
    };

    const finish = () => {
      if (done) return;
      done = true;
      if (timer) clearInterval(timer);
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, MIN_DURATION - elapsed);
      window.setTimeout(() => {
        setProgress(100);
        window.setTimeout(() => setPhase('type-en'), 250);
      }, remaining);
    };

    timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const { loaded, total } = checkAssets();
      const timeProgress = Math.min(elapsed / MIN_DURATION, 1) * 95;
      const assetProgress = total > 0 ? (loaded / total) * 95 : timeProgress;
      setProgress(Math.min(95, Math.max(timeProgress, assetProgress)));

      if (total > 0 && loaded === total && elapsed >= MIN_DURATION) finish();
      else if (elapsed >= MAX_DURATION) finish();
    }, 50);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [shouldShow, phase]);

  useEffect(() => {
    if (!shouldShow) return;
    let target = '';
    let interval = TYPE_INTERVAL_EN;
    let nextPhase: Phase = 'done';

    if (phase === 'type-en') {
      target = TEXT_EN;
      nextPhase = 'wipe-en';
    } else if (phase === 'type-cn') {
      target = TEXT_CN;
      interval = TYPE_INTERVAL_CN;
      nextPhase = 'wipe-cn';
    } else if (phase === 'type-final') {
      target = TEXT_FINAL;
      interval = TYPE_INTERVAL_CN;
      nextPhase = 'hold';
    } else {
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setText(target.slice(0, index));
      if (index >= target.length) {
        window.clearInterval(timer);
        window.setTimeout(() => setPhase(nextPhase), PAUSE_AFTER_TYPE);
      }
    }, interval);
    return () => window.clearInterval(timer);
  }, [shouldShow, phase]);

  useEffect(() => {
    if (!shouldShow) return;
    let source = '';
    let nextPhase: Phase = 'done';
    if (phase === 'wipe-en') {
      source = TEXT_EN;
      nextPhase = 'type-cn';
    } else if (phase === 'wipe-cn') {
      source = TEXT_CN;
      nextPhase = 'type-final';
    } else {
      return;
    }

    let head = source;
    const timer = window.setInterval(() => {
      if (head.length === 0) {
        window.clearInterval(timer);
        window.setTimeout(() => setPhase(nextPhase), PAUSE_AFTER_WIPE);
        return;
      }
      head = head.slice(0, -1);
      setText(head);
    }, WIPE_INTERVAL);
    return () => window.clearInterval(timer);
  }, [shouldShow, phase]);

  useEffect(() => {
    if (!shouldShow || phase !== 'hold') return;
    const timer = window.setTimeout(() => setPhase('exit'), FINAL_HOLD);
    return () => window.clearTimeout(timer);
  }, [shouldShow, phase]);

  useEffect(() => {
    if (!shouldShow || phase !== 'exit') return;

    const timer = window.setTimeout(() => {
      setPhase('done');
      setShouldShow(false);
      document.body.style.overflow = '';
      sessionStorage.setItem(SESSION_KEY, '1');
    }, EXIT_DURATION);
    return () => window.clearTimeout(timer);
  }, [shouldShow, phase]);

  if (!shouldShow) return null;

  const showTypingCaret =
    phase === 'type-en' || phase === 'type-cn' || phase === 'type-final' || phase === 'hold';
  const showWipeCaret = phase === 'wipe-en' || phase === 'wipe-cn';
  const isFinalPhase = phase === 'type-final' || phase === 'hold' || phase === 'exit';
  const mainTextClass = isFinalPhase
    ? 'font-sans text-5xl md:text-8xl lg:text-9xl font-medium text-[#FF4D26] tracking-[-0.06em]'
    : 'font-sans text-5xl md:text-7xl lg:text-8xl font-medium text-[#ECE9E1] tracking-[-0.04em]';
  const caretClass = isFinalPhase
    ? 'inline-block w-[0.07em] h-[0.88em] bg-[#FF4D26] ml-[0.06em] animate-pulse'
    : 'inline-block w-[0.05em] h-[0.88em] bg-[#ECE9E1] ml-[0.06em] animate-pulse';

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#0B0B0A] flex items-center justify-center
        transition-all duration-700 ease-out
        ${phase === 'exit' ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}`}
      role="status"
      aria-label="网站加载中"
    >
      <div className={`${mainTextClass} flex items-baseline gap-[0.05em] select-none min-h-[1.2em] max-w-[90vw] overflow-hidden`}>
        <span>{text}</span>
        {showWipeCaret && <span className="text-[#FF4D26]">\</span>}
        {showTypingCaret && <span className={caretClass} aria-hidden />}
      </div>

      <div className="absolute top-6 right-6 md:top-8 md:right-8 font-mono text-sm tracking-widest text-[#FF4D26] tabular-nums">
        {String(Math.floor(progress)).padStart(3, '0')}
      </div>

      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 font-mono text-[10px] tracking-[0.18em] text-[#9C998F]">
        {preloaderCopy.loading} / {preloaderCopy.context}
      </div>

      {phase === 'counting' && (
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 font-mono text-[10px] tracking-widest text-[#9C998F] tabular-nums">
          {Math.floor(progress)}%
        </div>
      )}
    </div>
  );
}
