'use client';

import { useEffect, useRef, useState } from 'react';

// Bilibili 视频映射表
const bilibiliVideoMap: Record<string, string> = {
  '/videos/001.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099846598&bvid=BV1TzZvBdEot&cid=36164601792&p=1',
  '/videos/002.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099844809&bvid=BV1MzZvBdEBF&cid=36164601797&p=1',
  '/videos/003.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099847116&bvid=BV1MzZvBdEK3&cid=36164601899&p=1',
  '/videos/独角兽.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099912656&bvid=BV1tzZvBdEeR&cid=36164601811&p=1',
  '/videos/blender1.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099844563&bvid=BV1MzZvBdEYs&cid=36164601972&p=1',
  '/videos/UE1.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099846613&bvid=BV1TzZvBdEoG&cid=36164602022&p=1',
  '/videos/UE2.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099845080&bvid=BV1MzZvBdEku&cid=36164601990&p=1',
  '/videos/UE3.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099846874&bvid=BV1MzZvBdEcW&cid=36164601997&p=1',
  '/videos/unicorn.mp4': '//player.bilibili.com/player.html?isOutside=true&aid=116098099912656&bvid=BV1tzZvBdEeR&cid=36164601811&p=1',
};

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
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

  // 获取 Bilibili URL
  const bilibiliSrc = bilibiliVideoMap[src];
  
  if (!bilibiliSrc) {
    return (
      <div className="video-player-wrapper">
        <div className="video-player-placeholder">
          <span className="video-player-text">视频未找到</span>
        </div>
      </div>
    );
  }

  // 优化 Bilibili URL 参数
  const optimizedSrc = `${bilibiliSrc}&danmaku=0&autoplay=0&high_quality=1&as_wide=1&noEndPanel=1&noShare=1&noRecommend=1&noDanmaku=1`;

  return (
    <div ref={containerRef} className="video-player-wrapper">
      {/* 封面占位 - 懒加载前显示 */}
      {!isInView && (
        <div className="video-player-placeholder">
          <div className="video-player-loading">
            <div className="video-player-spinner" />
            <span className="video-player-text">点击播放</span>
          </div>
        </div>
      )}

      {/* Bilibili iframe */}
      {isInView && (
        <iframe
          src={optimizedSrc}
          className="video-player-iframe"
          scrolling="no"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
          loading="lazy"
          title="Bilibili Video"
        />
      )}
    </div>
  );
}
