import { useEffect, useRef, useState } from 'react';
import { PortfolioDitherBackground } from '@/sections/portfolio/PortfolioDitherBackground';
import './boot-sequence.css';

/**
 * CRT boot sequence: the site plays a power-on ritual inside the CRT screen
 * area — black screen, power-on (dot → horizontal line → full white),
 * typewriter title with a block cursor, five cursor blinks, then a glitch
 * collapse back to black and out. Pure ceremony: no loading progress, no
 * sound. Any click / key skips; reduced motion never shows it; mobile plays
 * a shortened variant. The bezel frame is not covered.
 *
 * Replays on every load — confirmed behavior after Round 10 review (the
 * once-per-session sessionStorage gate `zhuyijia-crt-booted` was dropped
 * by user decision, not just for testing).
 */

const LINES = ['ZHU YIJIA PORTFOLIO', 'UE / C++ GAME DEVELOPER'];
/* Virtual gap ticks between the two typewriter lines. */
const LINE_GAP = 4;

const TYPE_TICK_MS = 55;
const POWER_ON_MS = 500;
const POWER_OFF_MS = 560;
const GLITCH_MS = 280;
const OFF_BEAT_MS = 0;

type Phase = 'off' | 'power' | 'typing' | 'blink' | 'shutdown' | 'done';

function shouldPlay(): boolean {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function BootSequence() {
  const [phase, setPhase] = useState<Phase>(() => (shouldPlay() ? 'off' : 'done'));
  const [typedTicks, setTypedTicks] = useState(0);
  /* Mobile plays a shortened variant: faster typing, fewer blinks, no glitch. */
  const simpleRef = useRef(window.matchMedia('(max-width: 720px)').matches);

  /* Lock page scroll while the ritual covers the screen. */
  useEffect(() => {
    if (phase === 'done') return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  /* Any click or key skips ahead. Once the screen is up (typing / blink),
     the skip still plays the glitch → collapse exit; before that (black /
     power-on) there is nothing to collapse, so it goes straight to the
     site. A skip during the exit itself is ignored so it never hard-cuts. */
  useEffect(() => {
    if (phase === 'done') return;
    const skip = () =>
      setPhase((current) => {
        if (current === 'typing' || current === 'blink') return 'shutdown';
        if (current === 'shutdown') return current;
        return 'done';
      });
    window.addEventListener('pointerdown', skip, { capture: true });
    window.addEventListener('keydown', skip, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', skip, { capture: true });
      window.removeEventListener('keydown', skip, { capture: true });
    };
  }, [phase]);

  /* Phase machine timing. */
  useEffect(() => {
    if (phase === 'done' || phase === 'typing') return;
    const simple = simpleRef.current;
    const timers: Partial<Record<Phase, number>> = {
      off: OFF_BEAT_MS,
      power: POWER_ON_MS,
      blink: (simple ? 3 : 5) * 420,
      shutdown: (simple ? 0 : GLITCH_MS) + POWER_OFF_MS,
    };
    const wait = timers[phase];
    if (wait === undefined) return;
    const timer = window.setTimeout(() => {
      setPhase((current) => {
        if (current === 'off') return 'power';
        if (current === 'power') return 'typing';
        if (current === 'blink') return 'shutdown';
        return 'done';
      });
    }, wait);
    return () => window.clearTimeout(timer);
  }, [phase]);

  /* Typewriter: one tick per character, plus a short gap between lines. */
  useEffect(() => {
    if (phase !== 'typing') return;
    const totalTicks = LINES[0].length + LINE_GAP + LINES[1].length;
    const interval = window.setInterval(
      () => {
        setTypedTicks((ticks) => {
          if (ticks >= totalTicks) {
            window.clearInterval(interval);
            setPhase('blink');
            return ticks;
          }
          return ticks + 1;
        });
      },
      simpleRef.current ? 40 : TYPE_TICK_MS,
    );
    return () => window.clearInterval(interval);
  }, [phase]);

  if (phase === 'done') return null;

  const firstLineLength = LINES[0].length;
  const first = LINES[0].slice(0, Math.min(typedTicks, firstLineLength));
  const second =
    typedTicks > firstLineLength + LINE_GAP
      ? LINES[1].slice(0, typedTicks - firstLineLength - LINE_GAP)
      : '';
  const cursorOnFirst = typedTicks <= firstLineLength + LINE_GAP;

  return (
    <div className="crt-boot" data-phase={phase} role="presentation">
      <div className="crt-boot-screen">
        {/* Same breathing dot field as the live site, painted behind the
            typewriter text so the boot screen matches the main background. */}
        <PortfolioDitherBackground frozen />
        {(phase === 'typing' || phase === 'blink' || phase === 'shutdown') && (
          <div className="crt-boot-text">
            <p className="crt-boot-title">
              {first}
              {cursorOnFirst && <span className="crt-boot-cursor" />}
            </p>
            {/* Always rendered so the second line never pushes the first up. */}
            <p className="crt-boot-subtitle">
              {second}
              {!cursorOnFirst && <span className="crt-boot-cursor" />}
              {cursorOnFirst && <span className="crt-boot-cursor crt-boot-cursor--idle" />}
            </p>
          </div>
        )}
      </div>
      <p className="crt-boot-skip">点击或按任意键跳过</p>
    </div>
  );
}
