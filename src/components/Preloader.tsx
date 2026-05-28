import { useEffect, useState } from 'react';

const MIN_DURATION = 1500;   // 至少展示 1.5 秒（让用户看到 0-100 动画）
const MAX_DURATION = 6000;   // 最多 6 秒兜底
const SESSION_KEY = 'preloader_shown_v3';

// 打字 / 擦除节奏（毫秒）
const TYPE_INTERVAL_EN = 55;
const TYPE_INTERVAL_CN = 110;
const WIPE_INTERVAL = 45;
const PAUSE_AFTER_TYPE = 220;
const PAUSE_AFTER_WIPE = 100;
const FINAL_HOLD = 500;
const EXIT_DURATION = 700;

const TEXT_EN = 'Zhu Yijia';
const TEXT_CN = '朱翊嘉';
const TEXT_FINAL = 'PORTFOLIO';

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

/**
 * 首屏加载 + 封面合并动画
 *
 * Phase 流程（详见 plan 1-ancient-aurora.md）：
 *   counting   ── 角落 0→100 跑数字 + 真实资源监测
 *   type-en    ── 中央打字 "Zhu Yijia"
 *   wipe-en    ── 橙色 \ 光标从右到左擦掉
 *   type-cn    ── 打字 "朱翊嘉"
 *   wipe-cn    ── \ 擦掉
 *   type-final ── 打字 "PORTFOLIO"（不擦）
 *   hold       ── 停 500ms
 *   exit       ── 整层上推淡出 + scrollTo #about
 *   done       ── 卸载
 */
export function Preloader() {
  const [shouldShow, setShouldShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (import.meta.env.DEV) return true;
    return !sessionStorage.getItem(SESSION_KEY);
  });
  const [phase, setPhase] = useState<Phase>('counting');
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');         // 当前主文字
  const [wipeChar, setWipeChar] = useState(''); // 擦除阶段尾部的 \ 光标
  const [exiting, setExiting] = useState(false);

  // ── Phase: counting ────────────────────────────────────────────
  useEffect(() => {
    if (!shouldShow || phase !== 'counting') return;
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let done = false;
    let timer: number | null = null;

    const checkAssets = () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      const total = imgs.length + videos.length;
      if (total === 0) return { loaded: 0, total: 0 };
      let loaded = 0;
      imgs.forEach((img) => { if (img.complete && img.naturalHeight > 0) loaded++; });
      videos.forEach((v) => { if (v.readyState >= 2) loaded++; });
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
        // 100 到达后短暂停 250ms 再进入打字阶段
        window.setTimeout(() => setPhase('type-en'), 250);
      }, remaining);
    };

    timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const { loaded, total } = checkAssets();
      const timeProgress = Math.min(elapsed / MIN_DURATION, 1) * 95;
      const assetProgress = total > 0 ? (loaded / total) * 95 : timeProgress;
      const next = Math.max(timeProgress, assetProgress);
      setProgress(Math.min(95, next));

      if (total > 0 && loaded === total && elapsed >= MIN_DURATION) finish();
      else if (elapsed >= MAX_DURATION) finish();
    }, 50);

    return () => { if (timer) clearInterval(timer); };
  }, [shouldShow, phase]);

  // ── Phase: type-en / type-cn / type-final ──────────────────────
  useEffect(() => {
    if (!shouldShow) return;
    let target = '';
    let interval = TYPE_INTERVAL_EN;
    let nextPhase: Phase = 'done';

    if (phase === 'type-en')        { target = TEXT_EN;    interval = TYPE_INTERVAL_EN; nextPhase = 'wipe-en'; }
    else if (phase === 'type-cn')   { target = TEXT_CN;    interval = TYPE_INTERVAL_CN; nextPhase = 'wipe-cn'; }
    else if (phase === 'type-final'){ target = TEXT_FINAL; interval = TYPE_INTERVAL_EN; nextPhase = 'hold'; }
    else return;

    setText('');
    setWipeChar('');
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setText(target.slice(0, i));
      if (i >= target.length) {
        window.clearInterval(t);
        window.setTimeout(() => setPhase(nextPhase), PAUSE_AFTER_TYPE);
      }
    }, interval);
    return () => window.clearInterval(t);
  }, [shouldShow, phase]);

  // ── Phase: wipe-en / wipe-cn ───────────────────────────────────
  useEffect(() => {
    if (!shouldShow) return;
    let source = '';
    let nextPhase: Phase = 'done';
    if (phase === 'wipe-en')      { source = TEXT_EN; nextPhase = 'type-cn'; }
    else if (phase === 'wipe-cn') { source = TEXT_CN; nextPhase = 'type-final'; }
    else return;

    // 把 \ 当成"光标"放在已有文字的末尾，每步往左吃掉一个字符
    let head = source;
    setText(head);
    setWipeChar('\\');
    const t = window.setInterval(() => {
      if (head.length === 0) {
        window.clearInterval(t);
        setWipeChar('');
        window.setTimeout(() => setPhase(nextPhase), PAUSE_AFTER_WIPE);
        return;
      }
      head = head.slice(0, -1);
      setText(head);
    }, WIPE_INTERVAL);
    return () => window.clearInterval(t);
  }, [shouldShow, phase]);

  // ── Phase: hold → exit ─────────────────────────────────────────
  useEffect(() => {
    if (!shouldShow || phase !== 'hold') return;
    const t = window.setTimeout(() => setPhase('exit'), FINAL_HOLD);
    return () => window.clearTimeout(t);
  }, [shouldShow, phase]);

  // ── Phase: exit ────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldShow || phase !== 'exit') return;
    setExiting(true);

    // 退出时把页面 scroll 锁到 About Me 顶端，避免出现任何"上方空区"
    const about = document.getElementById('about');
    if (about) {
      window.scrollTo({ top: about.offsetTop, behavior: 'instant' as ScrollBehavior });
    }

    const t = window.setTimeout(() => {
      setPhase('done');
      setShouldShow(false);
      document.body.style.overflow = '';
      sessionStorage.setItem(SESSION_KEY, '1');
    }, EXIT_DURATION);
    return () => window.clearTimeout(t);
  }, [shouldShow, phase]);

  if (!shouldShow) return null;

  // 打字光标（type 阶段尾部闪烁条）
  const showTypingCaret =
    phase === 'type-en' || phase === 'type-cn' || phase === 'type-final' || phase === 'hold';

  // 最终阶段 (PORTFOLIO) 切换到老 Hero 风格：Inter 800 + 橙色，区分于前面 mono 黑色
  const isFinalPhase = phase === 'type-final' || phase === 'hold' || phase === 'exit';
  const mainTextClass = isFinalPhase
    ? 'display-giant text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-[#FF3D00]'
    : 'font-mono text-5xl md:text-7xl lg:text-8xl text-[#1A1A1A] tracking-tight';
  const caretClass = isFinalPhase
    ? 'inline-block w-[0.08em] h-[0.85em] bg-[#FF3D00] ml-[0.05em] animate-pulse'
    : 'inline-block w-[0.06em] h-[0.9em] bg-[#1A1A1A] ml-[0.05em] animate-pulse';

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#D1D1CB] flex items-center justify-center
        transition-all duration-700 ease-out
        ${exiting ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}`}
    >
      {/* 主文字（中央） */}
      <div className={`${mainTextClass} flex items-baseline gap-[0.05em] select-none
                       min-h-[1.2em] max-w-[90vw] overflow-hidden`}>
        <span>{text}</span>
        {wipeChar && (
          <span className="text-[#FF3D00]">{wipeChar}</span>
        )}
        {showTypingCaret && (
          <span className={caretClass} aria-hidden />
        )}
      </div>

      {/* 右上角：0-100 数字 */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8
                      font-mono text-sm md:text-base tracking-widest text-[#FF3D00]/80 tabular-nums">
        {String(Math.floor(progress)).padStart(3, '0')}
      </div>

      {/* 左下角：LOADING ASSETS */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8
                      font-mono text-[10px] tracking-widest text-[#8A8A85]">
        LOADING ASSETS
      </div>

      {/* 右下角：% 进度 (counting 阶段才显示) */}
      {phase === 'counting' && (
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8
                        font-mono text-[10px] tracking-widest text-[#8A8A85] tabular-nums">
          {Math.floor(progress)}%
        </div>
      )}
    </div>
  );
}
