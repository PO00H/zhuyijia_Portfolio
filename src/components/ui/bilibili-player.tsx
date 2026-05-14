'use client';

import { useEffect, useRef, useState } from 'react';

interface BilibiliPlayerProps {
  src: string;
}

export function BilibiliPlayer({ src }: BilibiliPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer - 懒加载
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // 优化 Bilibili URL 参数
  const optimizedSrc = isInView
    ? `${src}&danmaku=0&autoplay=0&high_quality=1&as_wide=1&noEndPanel=1&noShare=1&noRecommend=1&noDanmaku=1&noFullscreen=0`
    : '';

  return (
    <div ref={containerRef} className="bilibili-player-wrapper">
      {/* 封面占位 - 懒加载前显示 */}
      {!isInView && (
        <div className="bilibili-player-placeholder">
          <div className="bilibili-player-loading">
            <div className="bilibili-player-spinner" />
            <span className="bilibili-player-text">点击播放</span>
          </div>
        </div>
      )}

      {/* Bilibili iframe */}
      {isInView && (
        <iframe
          src={optimizedSrc}
          className="bilibili-player-iframe"
          scrolling="no"
          frameBorder="0"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          loading="lazy"
          title="Bilibili Video"
        />
      )}
    </div>
  );
}
