"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const DotGridBackground = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const baseDotStyle: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle, rgba(241, 243, 235, 0.16) 0 1px, transparent 1px)`,
    backgroundSize: '12px 12px',
  };

  const gridLineStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(216, 255, 50, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(216, 255, 50, 0.035) 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
  };

  const signalFieldStyle: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle, rgba(216, 255, 50, 0.14) 0 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    WebkitMaskImage: 'linear-gradient(135deg, black 0%, transparent 34%)',
    maskImage: 'linear-gradient(135deg, black 0%, transparent 34%)',
  };

  return (
    <div
      className={cn(
        "fixed inset-0 w-full h-full",
        containerClassName
      )}
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={baseDotStyle}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={gridLineStyle}
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={signalFieldStyle}
      />

      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
};
