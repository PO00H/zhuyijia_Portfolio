import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Image as ImageIcon,
  Pause,
  Play,
  RotateCcw,
  Video,
} from 'lucide-react';
import { assetLabItems, type AssetKind, type AssetLabItem } from './assetLabData';
import './asset-lab.css';

type RatioKey = '16:9' | '4:3' | '1:1';
type AssetFilter = 'all' | AssetKind | 'pending';

interface CropSettings {
  ratio: RatioKey;
  zoom: number;
  positionX: number;
  positionY: number;
  posterTime: number;
  trimStart: number;
  trimEnd: number | null;
  approved: boolean;
}

type CropSettingsMap = Record<string, CropSettings>;

const storageKey = 'portfolio-asset-lab-v1';

const ratioValues: Record<RatioKey, number> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
};

const outputSizes: Record<RatioKey, { width: number; height: number }> = {
  '16:9': { width: 1600, height: 900 },
  '4:3': { width: 1440, height: 1080 },
  '1:1': { width: 1200, height: 1200 },
};

const createDefaultSettings = (): CropSettings => ({
  ratio: '16:9',
  zoom: 1,
  positionX: 0,
  positionY: 0,
  posterTime: 0,
  trimStart: 0,
  trimEnd: null,
  approved: false,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00.00';
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remaining.toFixed(2).padStart(5, '0')}`;
};

const loadStoredSettings = (): CropSettingsMap => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as CropSettingsMap) : {};
  } catch {
    return {};
  }
};

function AssetRow({
  item,
  active,
  approved,
  onSelect,
}: {
  item: AssetLabItem;
  active: boolean;
  approved: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`asset-lab-row ${active ? 'is-active' : ''}`}
      onClick={onSelect}
    >
      <span className="asset-lab-thumb">
        {item.kind === 'image' ? (
          <img src={item.path} alt="" loading="lazy" />
        ) : (
          <video src={item.path} muted preload="metadata" aria-hidden="true" />
        )}
        <span>{item.kind === 'image' ? <ImageIcon /> : <Video />}</span>
      </span>
      <span className="asset-lab-row-copy">
        <strong>{item.projectTitle}</strong>
        <small>{item.filename}</small>
        <em>{approved ? 'APPROVED' : 'PENDING'} · {item.extension}</em>
      </span>
      {approved && <Check className="asset-lab-approved-icon" aria-label="已确认" />}
    </button>
  );
}

export function AssetLab() {
  const [filter, setFilter] = useState<AssetFilter>('all');
  const [settingsMap, setSettingsMap] = useState<CropSettingsMap>(loadStoredSettings);
  const [selectedId, setSelectedId] = useState(assetLabItems[0]?.id ?? '');
  const [duration, setDuration] = useState(0);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{
    pointerX: number;
    pointerY: number;
    positionX: number;
    positionY: number;
    frameWidth: number;
    frameHeight: number;
  } | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(settingsMap));
  }, [settingsMap]);

  const filteredItems = useMemo(
    () => assetLabItems.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'pending') return !settingsMap[item.id]?.approved;
      return item.kind === filter;
    }),
    [filter, settingsMap],
  );

  const selectedItem =
    filteredItems.find((item) => item.id === selectedId) ??
    filteredItems[0] ??
    assetLabItems[0];
  const settings = settingsMap[selectedItem?.id] ?? createDefaultSettings();
  const outputSize = outputSizes[settings.ratio];
  const selectedIndex = filteredItems.findIndex((item) => item.id === selectedItem?.id);
  const approvedCount = assetLabItems.filter((item) => settingsMap[item.id]?.approved).length;

  const updateSettings = (changes: Partial<CropSettings>) => {
    if (!selectedItem) return;
    setSettingsMap((current) => ({
      ...current,
      [selectedItem.id]: {
        ...(current[selectedItem.id] ?? createDefaultSettings()),
        ...changes,
      },
    }));
  };

  const selectByOffset = (offset: number) => {
    if (!filteredItems.length) return;
    const nextIndex = clamp(selectedIndex + offset, 0, filteredItems.length - 1);
    setSelectedId(filteredItems[nextIndex].id);
  };

  const exportSettings = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      defaults: { ratio: '16:9', imageFormat: 'webp', videoFormat: 'mp4' },
      assets: assetLabItems.map((item) => ({
        id: item.id,
        projectId: item.projectId,
        source: item.path,
        kind: item.kind,
        output: outputSizes[(settingsMap[item.id] ?? createDefaultSettings()).ratio],
        crop: settingsMap[item.id] ?? createDefaultSettings(),
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'portfolio-asset-crops.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      positionX: settings.positionX,
      positionY: settings.positionY,
      frameWidth: bounds.width,
      frameHeight: bounds.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const deltaX = ((event.clientX - dragRef.current.pointerX) / dragRef.current.frameWidth) * 100;
    const deltaY = ((event.clientY - dragRef.current.pointerY) / dragRef.current.frameHeight) * 100;
    updateSettings({
      positionX: clamp(dragRef.current.positionX + deltaX, -50, 50),
      positionY: clamp(dragRef.current.positionY + deltaY, -50, 50),
    });
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateSettings({ zoom: clamp(settings.zoom - event.deltaY * 0.001, 1, 3) });
  };

  const setVideoTime = (value: number) => {
    const nextTime = clamp(value, 0, duration || 0);
    updateSettings({ posterTime: nextTime });
    if (videoRef.current) videoRef.current.currentTime = nextTime;
  };

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play();
    else video.pause();
  };

  const handleApprove = () => {
    updateSettings({ approved: true });
    window.setTimeout(() => selectByOffset(1), 0);
  };

  if (!selectedItem) {
    return <main className="asset-lab-empty">没有找到可裁切的图片或视频素材。</main>;
  }

  return (
    <main className="asset-lab-shell">
      <header className="asset-lab-header">
        <a href="/" className="asset-lab-brand">ASSET LAB</a>
        <a href="/">Portfolio</a>
        <button type="button" onClick={exportSettings}>
          <Download />
          Export JSON
        </button>
      </header>

      <aside className="asset-lab-assets">
        <div className="asset-lab-panel-heading">
          <h1>ASSETS</h1>
          <span>{assetLabItems.length}</span>
        </div>
        <div className="asset-lab-filters" aria-label="素材筛选">
          {(['all', 'image', 'video', 'pending'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'is-active' : ''}
              onClick={() => setFilter(value)}
            >
              {value.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="asset-lab-list">
          {filteredItems.map((item) => (
            <AssetRow
              key={item.id}
              item={item}
              active={item.id === selectedItem.id}
              approved={Boolean(settingsMap[item.id]?.approved)}
              onSelect={() => setSelectedId(item.id)}
            />
          ))}
        </div>
      </aside>

      <section className="asset-lab-workspace">
        <div className="asset-lab-titlebar">
          <div>
            <h2>{selectedItem.projectTitle}</h2>
            <p>{selectedItem.filename}</p>
          </div>
          <div className="asset-lab-source-meta">
            <span>{naturalSize.width || '—'} × {naturalSize.height || '—'}</span>
            <span>{selectedItem.kind.toUpperCase()}</span>
            {selectedItem.kind === 'video' && <span>{formatTime(duration)}</span>}
          </div>
        </div>

        <div className="asset-lab-canvas">
          <div
            className="asset-lab-crop-frame"
            style={{ aspectRatio: ratioValues[settings.ratio] }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
            onWheel={handleWheel}
          >
            {selectedItem.kind === 'image' ? (
              <img
                key={selectedItem.id}
                src={selectedItem.path}
                alt={selectedItem.projectTitle}
                draggable="false"
                onLoad={(event) => setNaturalSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })}
                style={{
                  transform: `translate3d(${settings.positionX}%, ${settings.positionY}%, 0) scale(${settings.zoom})`,
                }}
              />
            ) : (
              <video
                key={selectedItem.id}
                ref={videoRef}
                src={selectedItem.path}
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={(event) => {
                  const video = event.currentTarget;
                  setDuration(video.duration);
                  setNaturalSize({ width: video.videoWidth, height: video.videoHeight });
                  const trimEnd = settings.trimEnd ?? video.duration;
                  updateSettings({ trimEnd, posterTime: clamp(settings.posterTime, 0, video.duration) });
                  video.currentTime = clamp(settings.posterTime, 0, video.duration);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(event) => {
                  if (!event.currentTarget.paused) {
                    updateSettings({ posterTime: event.currentTarget.currentTime });
                  }
                }}
                style={{
                  transform: `translate3d(${settings.positionX}%, ${settings.positionY}%, 0) scale(${settings.zoom})`,
                }}
              />
            )}
            <div className="asset-lab-thirds" aria-hidden="true">
              <i /><i /><i /><i />
            </div>
            <div className="asset-lab-crop-corners" aria-hidden="true" />
          </div>
          <p>DRAG TO MOVE · SCROLL TO ZOOM</p>
        </div>

        {selectedItem.kind === 'video' ? (
          <div className="asset-lab-timeline">
            <div className="asset-lab-playback-row">
              <button type="button" onClick={togglePlayback} aria-label={isPlaying ? '暂停' : '播放'}>
                {isPlaying ? <Pause /> : <Play />}
              </button>
              <time>{formatTime(settings.posterTime)} / {formatTime(duration)}</time>
              <input
                aria-label="封面帧"
                type="range"
                min="0"
                max={duration || 0}
                step="0.01"
                value={clamp(settings.posterTime, 0, duration || 0)}
                onChange={(event) => setVideoTime(Number(event.target.value))}
              />
            </div>
            <div className="asset-lab-trim-editor">
              <div className="asset-lab-trim-track">
                <div
                  className="asset-lab-trim-selection"
                  style={{
                    left: `${duration ? (settings.trimStart / duration) * 100 : 0}%`,
                    right: `${duration ? 100 - ((settings.trimEnd ?? duration) / duration) * 100 : 0}%`,
                  }}
                />
                <input
                  aria-label="裁切开始时间"
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={settings.trimStart}
                  onChange={(event) => updateSettings({
                    trimStart: clamp(Number(event.target.value), 0, settings.trimEnd ?? duration),
                  })}
                />
                <input
                  aria-label="裁切结束时间"
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.01"
                  value={settings.trimEnd ?? duration}
                  onChange={(event) => updateSettings({
                    trimEnd: clamp(Number(event.target.value), settings.trimStart, duration),
                  })}
                />
              </div>
              <div className="asset-lab-trim-labels">
                <span>{formatTime(settings.trimStart)}</span>
                <span>TRIM RANGE</span>
                <span>{formatTime(settings.trimEnd ?? duration)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="asset-lab-image-note">IMAGE CROP · SOURCE REMAINS UNCHANGED</div>
        )}

        <footer className="asset-lab-workspace-footer">
          <button type="button" disabled={selectedIndex <= 0} onClick={() => selectByOffset(-1)}>
            <ChevronLeft /> Previous
          </button>
          <span>{selectedIndex + 1} / {filteredItems.length}</span>
          <button
            type="button"
            disabled={selectedIndex >= filteredItems.length - 1}
            onClick={() => selectByOffset(1)}
          >
            Next <ChevronRight />
          </button>
        </footer>
      </section>

      <aside className="asset-lab-inspector">
        <div className="asset-lab-panel-heading">
          <h2>OUTPUT</h2>
          <span>{settings.approved ? 'APPROVED' : 'PENDING'}</span>
        </div>

        <div className="asset-lab-ratios" aria-label="输出比例">
          {(Object.keys(ratioValues) as RatioKey[]).map((ratio) => (
            <button
              key={ratio}
              type="button"
              className={settings.ratio === ratio ? 'is-active' : ''}
              onClick={() => updateSettings({ ratio })}
            >
              {ratio}
            </button>
          ))}
        </div>

        <div className="asset-lab-output-size">
          <span>OUTPUT SIZE</span>
          <strong>{outputSize.width} × {outputSize.height}</strong>
        </div>

        <label className="asset-lab-control">
          <span>ZOOM <output>{settings.zoom.toFixed(2)}×</output></span>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={settings.zoom}
            onChange={(event) => updateSettings({ zoom: Number(event.target.value) })}
          />
        </label>

        <label className="asset-lab-control">
          <span>POSITION X <output>{settings.positionX.toFixed(1)}</output></span>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.1"
            value={settings.positionX}
            onChange={(event) => updateSettings({ positionX: Number(event.target.value) })}
          />
        </label>

        <label className="asset-lab-control">
          <span>POSITION Y <output>{settings.positionY.toFixed(1)}</output></span>
          <input
            type="range"
            min="-50"
            max="50"
            step="0.1"
            value={settings.positionY}
            onChange={(event) => updateSettings({ positionY: Number(event.target.value) })}
          />
        </label>

        {selectedItem.kind === 'video' && (
          <div className="asset-lab-video-fields">
            <label>
              <span>POSTER FRAME</span>
              <input
                type="number"
                min="0"
                max={duration}
                step="0.01"
                value={settings.posterTime.toFixed(2)}
                onChange={(event) => setVideoTime(Number(event.target.value))}
              />
            </label>
            <label>
              <span>TRIM START</span>
              <input
                type="number"
                min="0"
                max={settings.trimEnd ?? duration}
                step="0.01"
                value={settings.trimStart.toFixed(2)}
                onChange={(event) => updateSettings({
                  trimStart: clamp(Number(event.target.value), 0, settings.trimEnd ?? duration),
                })}
              />
            </label>
            <label>
              <span>TRIM END</span>
              <input
                type="number"
                min={settings.trimStart}
                max={duration}
                step="0.01"
                value={(settings.trimEnd ?? duration).toFixed(2)}
                onChange={(event) => updateSettings({
                  trimEnd: clamp(Number(event.target.value), settings.trimStart, duration),
                })}
              />
            </label>
          </div>
        )}

        <div className="asset-lab-inspector-actions">
          <button type="button" onClick={() => updateSettings(createDefaultSettings())}>
            <RotateCcw /> Reset
          </button>
          <button type="button" className="is-primary" onClick={handleApprove}>
            Approve & Next <Check />
          </button>
        </div>

        <p className="asset-lab-safety-note">Original files remain unchanged.</p>
        <div className="asset-lab-status">
          <span>{assetLabItems.length} assets</span>
          <span>{approvedCount} approved</span>
        </div>
      </aside>
    </main>
  );
}
