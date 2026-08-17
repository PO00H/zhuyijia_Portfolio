import { useEffect, useRef, useState } from 'react';
import {
  applyCrtShell,
  applySitePalette,
  CRT_SHELL_DEFAULTS,
  CRT_SHELL_PARAMS,
  DEFAULT_PALETTE,
  PALETTE_PRESETS,
  type ShellParam,
  type SitePalette,
} from '@/lib/live-theme';
import './color-tuner.css';

/**
 * Site color tuner (kept permanently): exposes every adjustable color of the
 * current palette as a single consolidated parameter (systems sharing a color
 * share one parameter), plus presets. Applies :root variables live and mutates
 * the shared dither palette. The CRT shell/shadow section writes the --crt-*
 * variables directly; presets may carry per-preset shell overrides.
 *
 * User adjustments are persisted to localStorage and can be exported/imported
 * as JSON for backup or transfer between devices.
 */

const STORAGE_KEY = 'zhuyijia-color-tuner-state';
const STATE_VERSION = 1;

interface SavedTunerState {
  version: number;
  presetId: string;
  values: SitePalette;
  veil: number;
  shell: Record<string, number>;
  bloomColor: string;
}

const saveTunerState = (state: SavedTunerState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore private-mode / quota errors.
  }
};

const loadTunerState = (): SavedTunerState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedTunerState;
    return parsed.version === STATE_VERSION ? parsed : null;
  } catch {
    return null;
  }
};

const PARAMS: { key: keyof SitePalette; label: string }[] = [
  { key: 'bg', label: '页面背景' },
  { key: 'ink', label: '主要文字' },
  { key: 'primary', label: '主色 / 点阵主色' },
  { key: 'deep', label: '深色 / 点阵深色' },
  { key: 'active', label: '交互色' },
  { key: 'title', label: '大标题色' },
  { key: 'muted', label: '辅助文字色' },
  { key: 'dotPaper', label: '点阵底色' },
  { key: 'frame', label: 'CRT 外框' },
  { key: 'veilColor', label: '遮罩 / 面板色' },
];

const SHELL_GROUPS: { name: string; params: ShellParam[] }[] = (() => {
  const groups: { name: string; params: ShellParam[] }[] = [];
  for (const param of CRT_SHELL_PARAMS) {
    let group = groups.find((entry) => entry.name === param.group);
    if (!group) {
      group = { name: param.group, params: [] };
      groups.push(group);
    }
    group.params.push(param);
  }
  return groups;
})();

const formatShellValue = (param: ShellParam, value: number) =>
  `${value}${param.unit ?? ''}`;

export function ColorTuner() {
  const saved = loadTunerState();
  const initialPreset = saved?.presetId ?? 'terminal';
  const initialValues = saved?.values ?? { ...DEFAULT_PALETTE };
  const initialVeil = saved?.veil ?? 0.6;
  const initialShell = saved?.shell ?? { ...CRT_SHELL_DEFAULTS };
  const initialBloom = saved?.bloomColor ?? '';

  const [values, setValues] = useState<SitePalette>(initialValues);
  const [veil, setVeil] = useState(initialVeil);
  const [shell, setShell] = useState<Record<string, number>>(initialShell);
  const [bloomColor, setBloomColor] = useState(initialBloom);
  const [presetId, setPresetId] = useState(initialPreset);
  const [collapsed, setCollapsed] = useState(false);
  const [shellOpen, setShellOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const persist = (
    next: Partial<SavedTunerState> & { values: SitePalette; veil: number; shell: Record<string, number>; bloomColor: string; presetId: string },
  ) => {
    saveTunerState({
      version: STATE_VERSION,
      presetId: next.presetId,
      values: next.values,
      veil: next.veil,
      shell: next.shell,
      bloomColor: next.bloomColor,
    });
  };

  const applyVeil = (value: number) => {
    setVeil(value);
    document.documentElement.style.setProperty('--site-veil', String(value));
    persist({ presetId, values, veil: value, shell, bloomColor });
  };

  const setColor = (key: keyof SitePalette, value: string) => {
    const nextPresetId = 'custom';
    setPresetId(nextPresetId);
    const nextValues = { ...values, [key]: value };
    setValues(nextValues);
    applySitePalette(nextValues);
    persist({ presetId: nextPresetId, values: nextValues, veil, shell, bloomColor });
  };

  const setShellValue = (varName: string, value: number) => {
    if (Number.isNaN(value)) return;
    const nextPresetId = 'custom';
    setPresetId(nextPresetId);
    const nextShell = { ...shell, [varName]: value };
    setShell(nextShell);
    applyCrtShell(nextShell);
    persist({ presetId: nextPresetId, values, veil, shell: nextShell, bloomColor });
  };

  const applyBloomColor = (value: string) => {
    setBloomColor(value);
    if (value) {
      document.documentElement.style.setProperty('--crt-text-bloom-color', value);
    } else {
      document.documentElement.style.removeProperty('--crt-text-bloom-color');
    }
    persist({ presetId, values, veil, shell, bloomColor: value });
  };

  const applyPreset = (presetId_: string) => {
    const preset = PALETTE_PRESETS.find((entry) => entry.id === presetId_);
    if (!preset) return;
    const nextValues = { ...preset.palette };
    const nextVeil = preset.veil ?? 0.6;
    const nextShell = { ...CRT_SHELL_DEFAULTS, ...preset.shell };
    setPresetId(preset.id);
    setValues(nextValues);
    setVeil(nextVeil);
    setShell(nextShell);
    setBloomColor('');
    applySitePalette(nextValues);
    document.documentElement.style.setProperty('--site-veil', String(nextVeil));
    applyCrtShell(nextShell);
    document.documentElement.style.removeProperty('--crt-text-bloom-color');
    persist({ presetId: preset.id, values: nextValues, veil: nextVeil, shell: nextShell, bloomColor: '' });
  };

  const resetToDefault = () => {
    applyPreset('terminal');
    applyBloomColor('');
  };

  const copyValues = () => {
    const shellLines = CRT_SHELL_PARAMS
      .filter((param) => shell[param.varName] !== param.defaultValue)
      .map((param) => `${param.varName}: ${formatShellValue(param, shell[param.varName])}`);
    const text = PARAMS.map(({ key }) => `${key}: '${values[key]}'`).join('\n')
      + `\nveil: ${veil}`
      + (shellLines.length ? `\n${shellLines.join('\n')}` : '')
      + (bloomColor ? `\nbloomColor: '${bloomColor}'` : '');
    void navigator.clipboard?.writeText(text);
  };

  const exportJson = () => {
    const state: SavedTunerState = {
      version: STATE_VERSION,
      presetId,
      values,
      veil,
      shell,
      bloomColor,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zhuyijia-theme-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SavedTunerState;
        if (parsed.version !== STATE_VERSION || !parsed.values || typeof parsed.veil !== 'number') {
          // eslint-disable-next-line no-alert
          window.alert('文件格式不正确或版本不匹配。');
          return;
        }
        setPresetId(parsed.presetId);
        setValues(parsed.values);
        setVeil(parsed.veil);
        setShell(parsed.shell);
        setBloomColor(parsed.bloomColor ?? '');
        applySitePalette(parsed.values);
        document.documentElement.style.setProperty('--site-veil', String(parsed.veil));
        applyCrtShell(parsed.shell);
        if (parsed.bloomColor) {
          document.documentElement.style.setProperty('--crt-text-bloom-color', parsed.bloomColor);
        } else {
          document.documentElement.style.removeProperty('--crt-text-bloom-color');
        }
        persist(parsed);
      } catch {
        // eslint-disable-next-line no-alert
        window.alert('无法解析该 JSON 文件。');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Apply persisted state to the DOM on first mount (the CSS may have loaded
  // with defaults before React hydrates).
  useEffect(() => {
    applySitePalette(values);
    document.documentElement.style.setProperty('--site-veil', String(veil));
    applyCrtShell(shell);
    if (bloomColor) {
      document.documentElement.style.setProperty('--crt-text-bloom-color', bloomColor);
    } else {
      document.documentElement.style.removeProperty('--crt-text-bloom-color');
    }
  }, []);

  return (
    <aside className="color-tuner" aria-label="全站配色调试">
      <header>
        <strong>配色调参</strong>
        <button type="button" onClick={() => setCollapsed((open) => !open)}>
          {collapsed ? '展开' : '收起'}
        </button>
      </header>

      {!collapsed && (
        <>
          <div className="color-tuner-presets">
            {PALETTE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={presetId === preset.id ? 'is-active' : undefined}
                onClick={() => applyPreset(preset.id)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="color-tuner-groups">
            <label className="color-tuner-range">
              <span>背景遮罩透明度</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={veil}
                onChange={(event) => applyVeil(Number(event.target.value))}
              />
              <output>{veil.toFixed(2)}</output>
            </label>
            {PARAMS.map(({ key, label }) => (
              <label key={key} className="color-tuner-color">
                <span>{label}</span>
                <input
                  type="color"
                  value={values[key]}
                  onChange={(event) => setColor(key, event.target.value)}
                />
                <output>{values[key]}</output>
              </label>
            ))}
          </div>

          <div className="color-tuner-shell">
            <button
              type="button"
              className="color-tuner-shell-toggle"
              onClick={() => setShellOpen((open) => !open)}
            >
              CRT 外壳阴影 {shellOpen ? '−' : '+'}
            </button>
            {shellOpen && (
              <div className="color-tuner-shell-groups">
                {SHELL_GROUPS.map((group) => (
                  <details key={group.name}>
                    <summary>{group.name}</summary>
                    {group.params.map((param) => (
                      <label key={param.varName} className="color-tuner-range">
                        <span>{param.label}</span>
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={shell[param.varName]}
                          onChange={(event) =>
                            setShellValue(param.varName, Number(event.target.value))
                          }
                        />
                        <input
                          className="color-tuner-number"
                          type="number"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={shell[param.varName]}
                          onChange={(event) =>
                            setShellValue(param.varName, Number(event.target.value))
                          }
                        />
                      </label>
                    ))}
                    {group.name === '文字泛光' && (
                      <label className="color-tuner-color">
                        <span>泛光颜色</span>
                        <input
                          type="color"
                          value={bloomColor || '#f4f7f2'}
                          onChange={(event) => applyBloomColor(event.target.value)}
                        />
                        <button
                          type="button"
                          className="color-tuner-follow"
                          title="恢复跟随文字颜色"
                          onClick={() => applyBloomColor('')}
                        >
                          {bloomColor || '跟随文字'}
                        </button>
                      </label>
                    )}
                  </details>
                ))}
              </div>
            )}
          </div>

          <footer>
            <button type="button" onClick={resetToDefault}>
              重置
            </button>
            <button type="button" onClick={exportJson}>
              导出 JSON
            </button>
            <button type="button" onClick={() => fileRef.current?.click()}>
              导入 JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={importJson}
              style={{ display: 'none' }}
            />
            <button type="button" onClick={copyValues}>
              复制参数
            </button>
          </footer>
        </>
      )}
    </aside>
  );
}
