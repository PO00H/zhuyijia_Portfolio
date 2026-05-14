import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export default function VideoPlayer({ 
  src, 
  poster = '/images/poster.jpg',
  className = '' 
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Intersection Observer - 20% threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px',
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load video when in view
  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.src = src;
      setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-[#1A1A1A]/5 rounded-2xl overflow-hidden ${className}`}
    >
      {/* Poster placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A]/10">
          <img 
            src={poster} 
            alt="Video poster"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              // 如果 poster 图片加载失败，显示默认占位
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[#FF3D00] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />
      
      {/* Video badge */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-[#FF3D00] text-white text-[10px] font-mono tracking-wider z-10">
        VIDEO
      </div>
    </div>
  );
}
