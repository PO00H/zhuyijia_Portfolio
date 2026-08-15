import { useState } from 'react';
import { useLightbox, type LightboxWindow } from '../code/LightboxContext';
import './retro-window.css';

/**
 * Retro program windows inside the CRT screen: Windows 3.1 / 95 chrome
 * (raised 2px bevel, pixel title bar, square close button top-right),
 * rendered inside the screen area (below the glass layer) so the monitor
 * illusion holds. Multiple windows stack with click-to-front; no dragging
 * (user decision). Mobile degrades to a full-screen sheet.
 */

function RetroWindow({ win, top }: { win: LightboxWindow; top: boolean }) {
  const { close, focus } = useLightbox();
  const [loading, setLoading] = useState(true);
  const [maximized, setMaximized] = useState(false);
  const isVideo = /\.(mp4|webm|mov|m4v)(\?|$)/i.test(win.url);

  return (
    <section
      className={`retro-window ${maximized ? 'is-maximized' : ''}`}
      style={{ zIndex: win.z }}
      data-focused={top || undefined}
      role="dialog"
      aria-label={win.title}
      onPointerDown={() => focus(win.key)}
    >
      <header className="retro-window-titlebar">
        <span className="retro-window-title">{win.title}</span>
        <button
          type="button"
          className="retro-window-max"
          aria-label={maximized ? '还原' : '最大化'}
          title={maximized ? '还原' : '最大化'}
          onClick={(event) => {
            event.stopPropagation();
            setMaximized((value) => !value);
          }}
        >
          <span className={`retro-icon ${maximized ? 'retro-icon-restore' : 'retro-icon-max'}`} />
        </button>
        <button
          type="button"
          className="retro-window-close"
          aria-label="关闭"
          onClick={(event) => {
            event.stopPropagation();
            close(win.key);
          }}
        >
          <span className="retro-icon retro-icon-close" />
        </button>
      </header>
      <div className="retro-window-body">
        {loading && (
          <div className="retro-window-loading">
            LOADING
            <span className="retro-window-cursor" />
          </div>
        )}
        {isVideo ? (
          <video
            key={win.key}
            src={win.url}
            title={win.title}
            controls
            autoPlay
            playsInline
            onLoadedData={() => setLoading(false)}
          />
        ) : (
          <iframe
            key={win.key}
            src={win.url}
            title={win.title}
            allow="autoplay; fullscreen; clipboard-write; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
    </section>
  );
}

export function RetroWindowLayer() {
  const { windows, close } = useLightbox();
  if (!windows.length) return null;

  const topZ = Math.max(...windows.map((win) => win.z));

  return (
    <div className="retro-wm">
      <button
        type="button"
        className="retro-wm-backdrop"
        aria-label="关闭最上层窗口"
        onClick={() => close()}
      />
      {windows.map((win, index) => (
        <div key={win.key} className="retro-window-slot" style={{ zIndex: win.z }}>
          <div
            className="retro-window-offset"
            style={{ transform: `translate(${index * 28}px, ${index * 22}px)` }}
          >
            <RetroWindow win={win} top={win.z === topZ} />
          </div>
        </div>
      ))}
    </div>
  );
}
