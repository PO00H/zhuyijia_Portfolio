import { SectionHeading } from './SectionHeading';

const skills = [
  'C++17',
  'Unreal Engine 5',
  'Blueprint',
  'Gameplay Systems',
  'Tools Development',
  'Blender',
  'PBR Pipeline',
];

const awards = [
  '全国大学生机器人创意大赛 · 国家三等奖',
  '浙江省大学生机器人创意大赛 · 一等奖',
  'AADC 北美应用艺术设计奖 · 金奖',
  'HKDADC · 一等奖',
];

export function ProfileSection() {
  return (
    <section id="profile" className="portfolio-section portfolio-profile-section">
      <SectionHeading
        index="07"
        eyebrow="履历摘要 / PROFILE"
        title="个人履历"
        description="保留招聘方快速判断所需的信息；详细工作内容已经放在实习项目经历中，不在这里重复。"
        variant="resume"
        meta={{ label: '履历模块', value: '04' }}
      />

      <div className="portfolio-profile-grid">
        <div className="portfolio-profile-block">
          <p className="section-label">教育经历 / EDUCATION</p>
          <dl className="portfolio-profile-list">
            <div>
              <dt>2025 — 2028</dt>
              <dd>北京林业大学 · 交互设计硕士</dd>
            </div>
            <div>
              <dt>2021 — 2025</dt>
              <dd>浙江农林大学 · 家具设计与工程本科</dd>
            </div>
          </dl>
        </div>

        <div className="portfolio-profile-block">
          <p className="section-label">相关经历 / EXPERIENCE</p>
          <dl className="portfolio-profile-list">
            <div>
              <dt>2026</dt>
              <dd>Meshy.ai · 技术美术实习生</dd>
            </div>
            <div>
              <dt>2024</dt>
              <dd>浙江无端科技 · 游戏交互实习生</dd>
            </div>
          </dl>
        </div>

        <div className="portfolio-profile-block">
          <p className="section-label">核心技能 / SKILLS</p>
          <ul className="portfolio-profile-skills">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="portfolio-profile-block">
          <p className="section-label">精选奖项 / AWARDS</p>
          <ul className="portfolio-profile-awards">
            {awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
