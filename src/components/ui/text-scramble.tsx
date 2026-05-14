'use client';

type TextScrambleProps = {
  children: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  className?: string;
  trigger?: boolean;
  onScrambleComplete?: () => void;
};

// Scramble 效果已全局禁用，组件保留为 pass-through 以避免改动调用点
export function TextScramble({ children, className }: TextScrambleProps) {
  return <span className={className}>{children}</span>;
}

export function TextScrambleWithHover({
  children,
  className,
}: Omit<TextScrambleProps, 'onScrambleComplete'> & { onMouseEnter?: () => void }) {
  return <span className={className}>{children}</span>;
}
