import { useState } from 'react';
import './crt-tuner.css';

interface TunerParam {
  key: string;
  label: string;
  max: number;
  unit?: string;
  step?: number;
}

interface TunerGroup {
  title: string;
  params: TunerParam[];
}

const GROUPS: TunerGroup[] = [
  {
    title: '四边压暗',
    params: [
      { key: '--crt-shadow-top', label: '上缘', max: 1 },
      { key: '--crt-shadow-bottom', label: '下缘', max: 1 },
      { key: '--crt-shadow-left', label: '左缘', max: 1 },
      { key: '--crt-shadow-right', label: '右缘', max: 1 },
    ],
  },
  {
    title: '角部径向暗部',
    params: [
      { key: '--crt-corner-dark-tl', label: '左上', max: 1 },
      { key: '--crt-corner-dark-tr', label: '右上', max: 1 },
      { key: '--crt-corner-dark-bl', label: '左下', max: 1 },
      { key: '--crt-corner-dark-br', label: '右下', max: 1 },
    ],
  },
  {
    title: '折角 · 左上',
    params: [
      { key: '--crt-fold-tl-dark', label: '暗端', max: 1 },
      { key: '--crt-fold-tl-light', label: '亮端', max: 1 },
      { key: '--crt-fold-tl-angle', label: '方向', max: 360, unit: 'deg', step: 1 },
      { key: '--crt-fold-tl-scale', label: '范围', max: 15, step: 0.05 },
      { key: '--crt-fold-tl-pos', label: '过渡位置', max: 100, step: 1 },
      { key: '--crt-fold-tl-band', label: '过渡宽度', max: 200, step: 1 },
    ],
  },
  {
    title: '折角 · 右上',
    params: [
      { key: '--crt-fold-tr-dark', label: '暗端', max: 1 },
      { key: '--crt-fold-tr-light', label: '亮端', max: 1 },
      { key: '--crt-fold-tr-angle', label: '方向', max: 360, unit: 'deg', step: 1 },
      { key: '--crt-fold-tr-scale', label: '范围', max: 15, step: 0.05 },
      { key: '--crt-fold-tr-pos', label: '过渡位置', max: 100, step: 1 },
      { key: '--crt-fold-tr-band', label: '过渡宽度', max: 200, step: 1 },
    ],
  },
  {
    title: '折角 · 左下',
    params: [
      { key: '--crt-fold-bl-dark', label: '暗端', max: 1 },
      { key: '--crt-fold-bl-light', label: '亮端', max: 1 },
      { key: '--crt-fold-bl-angle', label: '方向', max: 360, unit: 'deg', step: 1 },
      { key: '--crt-fold-bl-scale', label: '范围', max: 15, step: 0.05 },
      { key: '--crt-fold-bl-pos', label: '过渡位置', max: 100, step: 1 },
      { key: '--crt-fold-bl-band', label: '过渡宽度', max: 200, step: 1 },
    ],
  },
  {
    title: '折角 · 右下',
    params: [
      { key: '--crt-fold-br-dark', label: '暗端', max: 1 },
      { key: '--crt-fold-br-light', label: '亮端', max: 1 },
      { key: '--crt-fold-br-angle', label: '方向', max: 360, unit: 'deg', step: 1 },
      { key: '--crt-fold-br-scale', label: '范围', max: 15, step: 0.05 },
      { key: '--crt-fold-br-pos', label: '过渡位置', max: 100, step: 1 },
      { key: '--crt-fold-br-band', label: '过渡宽度', max: 200, step: 1 },
    ],
  },
  {
    title: '玻璃反光',
    params: [
      { key: '--crt-reflection', label: '主带', max: 1 },
      { key: '--crt-reflection-soft', label: '副带', max: 1 },
    ],
  },
];

const DEFAULTS: Record<string, string> = {
  '--crt-shadow-top': '0.79',
  '--crt-shadow-bottom': '0.535',
  '--crt-shadow-left': '0.715',
  '--crt-shadow-right': '0.695',
  '--crt-corner-dark-tl': '0.315',
  '--crt-corner-dark-tr': '0.315',
  '--crt-corner-dark-bl': '0.25',
  '--crt-corner-dark-br': '0.25',
  '--crt-fold-tl-dark': '0.56',
  '--crt-fold-tl-light': '0.21',
  '--crt-fold-tl-angle': '225',
  '--crt-fold-tl-scale': '15',
  '--crt-fold-tl-pos': '52',
  '--crt-fold-tl-band': '6',
  '--crt-fold-tr-dark': '0.48',
  '--crt-fold-tr-light': '0.365',
  '--crt-fold-tr-angle': '135',
  '--crt-fold-tr-scale': '14',
  '--crt-fold-tr-pos': '52',
  '--crt-fold-tr-band': '6',
  '--crt-fold-bl-dark': '0.94',
  '--crt-fold-bl-light': '0.665',
  '--crt-fold-bl-angle': '135',
  '--crt-fold-bl-scale': '11.7',
  '--crt-fold-bl-pos': '52',
  '--crt-fold-bl-band': '6',
  '--crt-fold-br-dark': '0.42',
  '--crt-fold-br-light': '0.475',
  '--crt-fold-br-angle': '225',
  '--crt-fold-br-scale': '11.7',
  '--crt-fold-br-pos': '50',
  '--crt-fold-br-band': '4',
  '--crt-reflection': '0.355',
  '--crt-reflection-soft': '0.045',
};

const ALL_PARAMS = GROUPS.flatMap((group) => group.params);

function readCurrent(key: string): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : Number.parseFloat(DEFAULTS[key]);
}

/** Temporary on-page tuner for the CRT shell shading. Delete after review. */
export function CrtTuner() {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(ALL_PARAMS.map(({ key }) => [key, readCurrent(key)])),
  );
  const [collapsed, setCollapsed] = useState(false);

  const applyValue = (param: TunerParam, value: number) => {
    const serialized = param.unit ? `${value}${param.unit}` : String(value);
    document.documentElement.style.setProperty(param.key, serialized);
    setValues((current) => ({ ...current, [param.key]: value }));
  };

  const resetAll = () => {
    ALL_PARAMS.forEach((param) => {
      const fallback = DEFAULTS[param.key];
      document.documentElement.style.setProperty(
        param.key,
        param.unit ? `${fallback}${param.unit}` : fallback,
      );
    });
    setValues(
      Object.fromEntries(ALL_PARAMS.map(({ key }) => [key, Number.parseFloat(DEFAULTS[key])])),
    );
  };

  const copyValues = () => {
    const text = ALL_PARAMS.map((param) => {
      const value = values[param.key];
      return `${param.key}: ${value}${param.unit ?? ''};`;
    }).join('\n');
    void navigator.clipboard?.writeText(text);
  };

  return (
    <aside className="crt-tuner" aria-label="CRT 外壳参数调试">
      <header>
        <strong>CRT 调参</strong>
        <button type="button" onClick={() => setCollapsed((open) => !open)}>
          {collapsed ? '展开' : '收起'}
        </button>
      </header>

      {!collapsed && (
        <>
          <div className="crt-tuner-groups">
            {GROUPS.map((group) => (
              <section key={group.title}>
                <h2>{group.title}</h2>
                {group.params.map((param) => (
                  <label key={param.key}>
                    <span>
                      {param.label}
                      <output>
                        {param.unit ? `${values[param.key]}${param.unit}` : values[param.key].toFixed(3)}
                      </output>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={param.max}
                      step={param.step ?? 0.005}
                      value={values[param.key]}
                      onChange={(event) => applyValue(param, Number(event.target.value))}
                    />
                  </label>
                ))}
              </section>
            ))}
          </div>
          <footer>
            <button type="button" onClick={resetAll}>
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
