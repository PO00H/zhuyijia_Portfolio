import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { toggleActiveMedia } from './supportMediaState';

interface SupportingSectionsModule {
  SupportingSections: ComponentType;
}

async function loadSupportingSections(): Promise<SupportingSectionsModule | null> {
  const modulePath = './SupportingSections';
  return import(modulePath).catch(() => null) as Promise<SupportingSectionsModule | null>;
}

describe('Phase 4 supporting sections', () => {
  it('provides one-active-media toggle behavior', () => {
    expect(toggleActiveMedia(null, 'ik-retargeting')).toBe('ik-retargeting');
    expect(toggleActiveMedia('ik-retargeting', 'ik-retargeting')).toBeNull();
    expect(toggleActiveMedia('ik-retargeting', 'stonecity')).toBe('stonecity');
  });

  it('renders lightweight preview triggers before media activation', async () => {
    const supportModule = await loadSupportingSections();

    expect(supportModule).not.toBeNull();
    if (!supportModule) return;

    const markup = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(supportModule.SupportingSections),
      ),
    );

    expect(markup).not.toContain('<video');
    expect(markup).not.toContain('<iframe');
    expect(markup).toContain('data-preview-src="/videos/UE1.mp4"');
    expect(markup).toContain('data-preview-src="/videos/002.mp4"');
    expect(markup).toContain('data-support-project="tajima-cutter"');
  });
});
