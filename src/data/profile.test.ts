import { describe, expect, it } from 'vitest';

interface ProfileModule {
  profile: {
    awards: Array<{ title: string }>;
    education: Array<{ institution: string }>;
    experience: Array<{ company: string }>;
    publicContact: { email: string };
  };
}

async function loadProfile(): Promise<ProfileModule | null> {
  const modulePath = './profile';
  return import(modulePath).catch(() => null) as Promise<ProfileModule | null>;
}

describe('public profile data', () => {
  it('contains confirmed education, game-related experience, and awards', async () => {
    const profileModule = await loadProfile();

    expect(profileModule).not.toBeNull();
    if (!profileModule) return;
    expect(profileModule.profile.education.some((item) => item.institution === '北京林业大学')).toBe(true);
    expect(profileModule.profile.experience.some((item) => item.company === '北京格拉菲克斯 — Meshy.ai')).toBe(true);
    expect(profileModule.profile.experience.some((item) => item.company === '浙江无端科技有限公司')).toBe(true);
    expect(profileModule.profile.awards.some((item) => item.title.includes('全国大学生机器人创意大赛'))).toBe(true);
  });

  it('only exposes email as public contact data', async () => {
    const profileModule = await loadProfile();

    expect(profileModule).not.toBeNull();
    if (!profileModule) return;
    expect(profileModule.profile.publicContact).toEqual({ email: '1002520702@qq.com' });
    expect(JSON.stringify(profileModule.profile)).not.toContain('13757722815');
    expect(JSON.stringify(profileModule.profile)).not.toContain('21岁');
    expect(JSON.stringify(profileModule.profile)).not.toContain('户籍');
    expect(JSON.stringify(profileModule.profile)).not.toContain('微信');
  });
});
