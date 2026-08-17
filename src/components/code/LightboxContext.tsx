import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 全局复古窗口管理器：任何卡片传 { url, title } 就能开出一个 CRT 内的
 * 复古程序窗口。支持多窗口共存，点击窗口置前（z 计数器），ESC / 背景
 * 点击关闭最上层窗口。不做拖动（用户决定）。
 */
export interface LightboxTarget {
  url: string;
  title: string;
  id?: string;
}

export interface LightboxWindow extends LightboxTarget {
  key: string;
  z: number;
}

interface LightboxContextValue {
  windows: LightboxWindow[];
  open: (target: LightboxTarget) => void;
  /** 无参关闭当前最上层窗口。 */
  close: (key?: string) => void;
  focus: (key: string) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<LightboxWindow[]>([]);
  const zCounter = useRef(0);

  const open = useCallback((target: LightboxTarget) => {
    const key = target.id ?? target.url;
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((current) => {
      const existing = current.find((win) => win.key === key);
      if (existing) {
        return current.map((win) => (win.key === key ? { ...win, ...target, z } : win));
      }
      return [...current, { ...target, key, z }];
    });
  }, []);

  const close = useCallback((key?: string) => {
    setWindows((current) => {
      if (key) return current.filter((win) => win.key !== key);
      if (!current.length) return current;
      const top = current.reduce((a, b) => (a.z > b.z ? a : b));
      return current.filter((win) => win.key !== top.key);
    });
  }, []);

  const focus = useCallback((key: string) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows((current) => current.map((win) => (win.key === key ? { ...win, z } : win)));
  }, []);

  /* 有窗口打开时锁定页面滚动。 */
  useEffect(() => {
    if (!windows.length) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [windows.length]);

  /* ESC 关闭最上层窗口。 */
  useEffect(() => {
    if (!windows.length) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [windows.length, close]);

  return (
    <LightboxContext.Provider value={{ windows, open, close, focus }}>
      {children}
    </LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}
