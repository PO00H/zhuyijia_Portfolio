import { useEffect, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useLightbox } from './LightboxContext';

export function IframeLightbox() {
  const { active, close } = useLightbox();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (active) {
      setLoading(true);
      setFullscreen(false); // 每次打开新项目时回到普通尺寸
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
      setFullscreen(false);
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 全屏时 ESC 先退全屏，再 ESC 才关闭
        if (fullscreen) setFullscreen(false);
        else close();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, close, fullscreen]);

  if (!active) return null;

  const displayUrl =
    active.url === 'about:blank'
      ? `zhuyijia.art/embed/${active.id ?? ''}`
      : active.url.replace(/^https?:\/\//, '').slice(0, 60);

  // 全屏时去掉外层 padding 让窗口铺满
  const overlayPadding = fullscreen ? 'p-0' : 'p-4 md:p-12';
  // 全屏时去掉 max-width / max-height + 圆角
  const frameClasses = fullscreen
    ? 'max-w-none max-h-none rounded-none'
    : 'max-w-[1400px] max-h-[900px] rounded-2xl';

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center transition-[opacity,padding] duration-300 ${overlayPadding} ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={close}
    >
      <div
        className={`relative w-full h-full bg-white overflow-hidden shadow-2xl flex flex-col transition-[transform,max-width,max-height,border-radius] duration-300 ${frameClasses} ${
          mounted ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Safari-style 顶栏 */}
        <div className="h-10 bg-[#F0F0F0] flex items-center px-4 gap-3 border-b border-gray-200 flex-shrink-0">
          {/* Traffic lights */}
          <div className="flex gap-2 group/lights">
            {/* 红 — 关闭 */}
            <button
              onClick={close}
              className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 transition-opacity relative flex items-center justify-center"
              aria-label="Close"
              title="关闭"
            >
              <X
                className="w-2 h-2 text-[#7c0a0a] opacity-0 group-hover/lights:opacity-100 transition-opacity"
                strokeWidth={2.5}
              />
            </button>
            {/* 黄 — 占位（macOS 上是最小化，浏览器内无对应行为）*/}
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" title="minimize (n/a)" />
            {/* 绿 — 切换全屏 */}
            <button
              onClick={() => setFullscreen((v) => !v)}
              className="w-3 h-3 rounded-full bg-[#28C840] hover:opacity-80 transition-opacity relative flex items-center justify-center"
              aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              title={fullscreen ? '退出全屏' : '全屏'}
            >
              {fullscreen ? (
                <Minimize2
                  className="w-2 h-2 text-[#0a4a0a] opacity-0 group-hover/lights:opacity-100 transition-opacity"
                  strokeWidth={2.5}
                />
              ) : (
                <Maximize2
                  className="w-2 h-2 text-[#0a4a0a] opacity-0 group-hover/lights:opacity-100 transition-opacity"
                  strokeWidth={2.5}
                />
              )}
            </button>
          </div>

          {/* URL bar */}
          <div className="flex-1 mx-auto max-w-md bg-white rounded-md px-3 py-1 text-xs font-mono text-gray-600 text-center truncate">
            🔒 {displayUrl}
          </div>

          {/* Close X (备用) */}
          <button
            onClick={close}
            className="text-gray-500 hover:text-black transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-10 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-10">
            <div className="font-mono text-xs text-[#8A8A85] tracking-wider">LOADING…</div>
          </div>
        )}

        {/* 内容：本地视频文件用 video，其他用 iframe */}
        {/\.(mp4|webm|mov|m4v)(\?|$)/i.test(active.url) ? (
          <video
            key={active.id ?? active.url}
            src={active.url}
            title={active.title}
            controls
            autoPlay
            playsInline
            className="flex-1 w-full bg-black object-contain"
            onLoadedData={() => setLoading(false)}
          />
        ) : (
          <iframe
            key={active.id ?? active.url}
            src={active.url}
            title={active.title}
            className="flex-1 w-full border-0"
            allow="autoplay; fullscreen; clipboard-write; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
    </div>
  );
}
