import { useEffect, useState } from 'react';
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
 * Site color tuner (hidden by default): exposes every adjustable color of the
 * current palette as a single consolidated parameter (systems sharing a color
 * share one parameter), plus presets. Applies :root variables live and mutates
 * the shared dither palette. The CRT shell/shadow section writes the --crt-*
 * variables directly; presets may carry per-preset shell overrides.
 *
 * The panel is not rendered by default. Open it via the URL hash `#tuner`
 * or the keyboard shortcut Ctrl+Shift+T; close it with the same shortcut or
 * the header close button. Refreshing the page restores the default theme.
 */

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
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.location.hash === '#tuner',
  );
  const [values, setValues] = useState<SitePalette>({ ...DEFAULT_PALETTE });
  const [veil, setVeil] = useState(0.6);
  const [shell, setShell] = useState<Record<string, number>>({ ...CRT_SHELL_DEFAULTS });
  const [bloomColor, setBloomColor] = useState('');
  const [presetId, setPresetId] = useState('terminal');
  const [collapsed, setCollapsed] = useState(false);
  const [shellOpen, setShellOpen] = useState(false);

  const apply = (palette: SitePalette) => {
    setValues(palette);
    applySitePalette(palette);
  };

  const applyVeil = (value: number) => {
    setVeil(value);
    document.documentElement.style.setProperty('--site-veil', String(value));
  };

  const applyShell = (values: Record<string, number>) => {
    setShell(values);
    applyCrtShell(values);
  };

  const setColor = (key: keyof SitePalette, value: string) => {
    setPresetId('custom');
    apply({ ...values, [key]: value });
  };

  const setShellValue = (varName: string, value: number) => {
    if (Number.isNaN(value)) return;
    setPresetId('custom');
    applyShell({ ...shell, [varName]: value });
  };

  const applyBloomColor = (value: string) => {
    setBloomColor(value);
    if (value) {
      document.documentElement.style.setProperty('--crt-text-bloom-color', value);
    } else {
      document.documentElement.style.removeProperty('--crt-text-bloom-color');
    }
  };

  const applyPreset = (presetId_: string) => {
    const preset = PALETTE_PRESETS.find((entry) => entry.id === presetId_);
    if (!preset) return;
    setPresetId(preset.id);
    apply({ ...preset.palette });
    applyVeil(preset.veil ?? 0.6);
    applyShell({ ...CRT_SHELL_DEFAULTS, ...preset.shell });
  };

  useEffect(() => {
    const onHashChange = () => setVisible(window.location.hash === '#tuner');
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 't') {
        event.preventDefault();
        setVisible((open) => !open);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

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

  if (!visible) return null;

  return (
    <aside className="color-tuner" aria-label="全站配色调试">
      <header>
        <strong>配色调参</strong>
        <button type="button" onClick={() => setCollapsed((open) => !open)}>
          {collapsed ? '展开' : '收起'}
        </button>
        <button type="button" onClick={() => setVisible(false)} title="关闭（Ctrl+Shift+T 重新打开）">
          关闭
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
            <button
              type="button"
              onClick={() => {
                applyPreset('terminal');
                applyBloomColor('');
              }}
            >
              重置
            </button>
            <button type="button" onClick={copyValues}>
              复制参数
            </button>
          </footer>
        </>
      )}
    </aside>
  );
}
