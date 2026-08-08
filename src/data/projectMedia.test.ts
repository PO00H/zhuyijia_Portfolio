import { describe, expect, it } from 'vitest';

import { getProjectPreview } from './projectMedia';
import { getPublicProjects } from './projects';

describe('archive media mapping', () => {
  it('uses local real media for every Worlds card', () => {
    const projects = getPublicProjects();
    const peak = projects.find((project) => project.slug === 'peak');
    const tajima = projects.find((project) => project.slug === 'tajima-cutter');

    expect(peak).toBeDefined();
    expect(tajima).toBeDefined();
    expect(getProjectPreview(peak!)).toBe('/posters/peak.jpg');
    expect(getProjectPreview(tajima!)).toBe('/textures/T_TAJIMA_BC.png');
  });
});
