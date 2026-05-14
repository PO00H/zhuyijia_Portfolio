"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef, useCallback } from "react";

export const DotGridBackground = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  // 基础淡灰色点 - 0.375px，间距6px
  const baseDotStyle: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle, rgba(140, 140, 135, 0.4) 0.375px, transparent 0.375px)`,
    backgroundSize: '6px 6px',
  };

  // 橙色点遮罩样式 - 200px范围
  const orangeMaskStyle: React.CSSProperties = isHovering ? {
    backgroundImage: `radial-gradient(circle, rgba(255, 61, 0, 0.8) 0.375px, transparent 0.375px)`,
    backgroundSize: '6px 6px',
    WebkitMaskImage: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
    maskImage: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
    opacity: 1,
  } : {
    opacity: 0,
  };

  // 中心放大点遮罩样式 - 80px范围，点大小0.75px
  const centerMaskStyle: React.CSSProperties = isHovering ? {
    backgroundImage: `radial-gradient(circle, rgba(255, 61, 0, 0.8) 0.75px, transparent 0.75px)`,
    backgroundSize: '6px 6px',
    WebkitMaskImage: `radial-gradient(80px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
    maskImage: `radial-gradient(80px circle at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
    opacity: 1,
  } : {
    opacity: 0,
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 w-full h-full",
        containerClassName
      )}
      style={{ zIndex: 0 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 默认状态：淡灰色小点 */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={baseDotStyle}
      />
      
      {/* 悬停时的橙色点效果 - 200px渐变范围 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={orangeMaskStyle}
      />

      {/* 中心放大点效果 - 80px范围 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={centerMaskStyle}
      />

      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
};
