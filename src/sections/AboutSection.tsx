import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Briefcase, GraduationCap, User, Mail, Phone, MapPin, Languages } from 'lucide-react';
import { TextScrambleWithHover } from '@/components/ui/text-scramble';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  period: string;
  title: string;
  subtitle: string;
  description?: string;
}

const educationData: TimelineItem[] = [
  {
    period: '21.09 — 25.06',
    title: '浙江农林大学',
    subtitle: '家具材料与工程(本科)',
    description: '主修课程:家具设计，室内设计，工程力学，人体工学，家具材料学，木材学',
  },
  {
    period: '21.09 — 23.09',
    title: '浙江农林大学',
    subtitle: '日语(专业辅修)',
  },
  {
    period: '25.09 — 28.09',
    title: '北京林业大学',
    subtitle: '人机交互设计(研究生)',
  },
];

const experienceData: TimelineItem[] = [
  {
    period: '23.07 — 23.09',
    title: '温州几米家具有限公司(产品方向)',
    subtitle: '实习生',
    description: '实习内容:参与网站建设、广告策划、和参与产品设计开发',
  },
  {
    period: '24.02 — 24.04',
    title: '温州澳珀家俱有限公司(产品方向)',
    subtitle: '实习生',
    description: '实习内容:根据制图规范辅助制作家具零部件产品工程图',
  },
  {
    period: '24.06 — 24.08',
    title: '浙江无端科技有限公司(游戏交互设计)',
    subtitle: '实习生',
    description: '实习内容:学习并协助设计用户调研方案，整理用户反馈数据;市场竞品分析',
  },
];

const awardsData: TimelineItem[] = [
  {
    period: '国家级',
    title: '全国大学生机器人创意大赛：三等奖',
    subtitle: '',
  },
  {
    period: '省级',
    title: '浙江省大学生机器人创意大赛：一等奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: 'BICC中英国际创意大赛：银奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第二届·AADC北美应用艺术设计奖：金奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第二届·AADC北美应用艺术设计奖：铜奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第二届·AADC北美应用艺术设计奖：铜奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第四届HKDADC：一等奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第四届HKDADC：三等奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第四届HKDADC：三等奖',
    subtitle: '',
  },
  {
    period: '2025',
    title: '第六届·G-CRSOSS跨界艺术创意奖：佳作奖',
    subtitle: '',
  },
];

const personalInfo = [
  { icon: User, label: '年龄', value: '21岁' },
  { icon: Mail, label: '电子邮件', value: '1002520702@qq.com' },
  { icon: Phone, label: '电话/微信', value: '13757722815' },
  { icon: MapPin, label: '户籍所在地', value: '浙江·温州' },
  { icon: Languages, label: '语言能力', value: 'CET-6' },
];

function TimelineBlock({
  title,
  icon: Icon,
  items,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  items: TimelineItem[];
  delay?: number;
}) {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const elements = block.querySelectorAll('.timeline-item');
    const titleEl = block.querySelector('.block-title');

    gsap.set(titleEl, { y: 30, opacity: 0 });
    gsap.set(elements, { y: 40, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(titleEl, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      delay,
    }).to(
      elements,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === block) {
          trigger.kill();
        }
      });
    };
  }, [delay]);

  return (
    <div ref={blockRef} className="flex-1 min-w-[280px]">
      {/* Block Title */}
      <div className="block-title flex items-center gap-3 mb-8 pb-4 border-b border-[#8A8A85]/30">
        <Icon className="w-5 h-5 text-[#FF3D00]" strokeWidth={1.5} />
        <h3 className="section-label text-[#1A1A1A]">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
            {title}
          </TextScrambleWithHover>
        </h3>
      </div>

      {/* Timeline Items */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="timeline-item group cursor-default"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="work-index text-[#8A8A85] group-hover:text-[#FF3D00] transition-colors">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {String(index + 1).padStart(2, '0')}
                </TextScrambleWithHover>
              </span>
              <span className="work-index text-[#8A8A85]/60">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {item.period}
                </TextScrambleWithHover>
              </span>
            </div>
            <h4 className="font-medium text-[#1A1A1A] text-sm mb-0.5 group-hover:text-[#FF3D00] transition-colors">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {item.title}
              </TextScrambleWithHover>
            </h4>
            <p className="body-mono text-[#8A8A85] mb-1">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {item.subtitle}
              </TextScrambleWithHover>
            </p>
            {item.description && (
              <p className="body-mono text-[#8A8A85]/70 leading-relaxed">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {item.description}
                </TextScrambleWithHover>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AwardsBlock() {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const elements = block.querySelectorAll('.award-item');
    const titleEl = block.querySelector('.block-title');

    gsap.set(titleEl, { y: 30, opacity: 0 });
    gsap.set(elements, { y: 40, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(titleEl, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }).to(
      elements,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === block) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={blockRef} className="mt-16 pt-16 border-t border-[#8A8A85]/20">
      {/* Block Title */}
      <div className="block-title flex items-center gap-3 mb-8 pb-4 border-b border-[#8A8A85]/30">
        <Award className="w-5 h-5 text-[#FF3D00]" strokeWidth={1.5} />
        <h3 className="section-label text-[#1A1A1A]">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
            AWARDS · 奖项
          </TextScrambleWithHover>
        </h3>
      </div>

      {/* Awards Grid - 5 columns for more awards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4">
        {awardsData.map((item, index) => (
          <div
            key={index}
            className="award-item group cursor-default"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="work-index text-[#8A8A85] group-hover:text-[#FF3D00] transition-colors">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {String(index + 1).padStart(2, '0')}
                </TextScrambleWithHover>
              </span>
              <span className="work-index text-[#8A8A85]/60 text-[10px]">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {item.period}
                </TextScrambleWithHover>
              </span>
            </div>
            <h4 className="font-medium text-[#1A1A1A] text-sm group-hover:text-[#FF3D00] transition-colors leading-tight">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {item.title}
              </TextScrambleWithHover>
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsBlock() {
  const blockRef = useRef<HTMLDivElement>(null);

  const skillCategories = [
    {
      title: '引擎 · Engine',
      skills: ['Unreal Engine 5'],
    },
    {
      title: '三维建模与数字雕刻 · 3D Modeling & Sculpting',
      skills: ['Maya', 'ZBrush', 'Blender'],
    },
    {
      title: '纹理、材质与视觉特效 · Texturing, Materials & VFX',
      skills: ['Substance Suite', 'Niagara'],
    },
    {
      title: '程序化与底层逻辑 · Procedural & Logic',
      skills: ['C++', 'JavaScript', 'HTML', 'CSS'],
    },
  ];

  const aiCategories = [
    {
      title: '01 文生图工具',
      skills: ['Midjourney', 'Stable Diffusion', '即梦'],
    },
    {
      title: '02 大语言模型',
      skills: ['Google Gemini 3 Pro', 'Kimi', 'ChatGPT', 'DeepSeek'],
    },
    {
      title: '03 AI编程工具',
      skills: ['Claude', 'OpenClaw', 'VSCode Cline'],
    },
  ];

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const titleEl = block.querySelector('.skills-title');
    const categoryEls = block.querySelectorAll('.skill-category');

    gsap.set(titleEl, { y: 30, opacity: 0 });
    gsap.set(categoryEls, { y: 40, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(titleEl, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }).to(
      categoryEls,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === block) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleSkillHover = (e: React.MouseEvent<HTMLSpanElement>, isEnter: boolean) => {
    const target = e.currentTarget;
    if (isEnter) {
      gsap.to(target, {
        scale: 1.05,
        boxShadow: '0 0 20px rgba(255, 61, 0, 0.5), 0 0 40px rgba(255, 61, 0, 0.3)',
        borderColor: '#FF3D00',
        color: '#FF3D00',
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      gsap.to(target, {
        scale: 1,
        boxShadow: '0 0 0px rgba(255, 61, 0, 0)',
        borderColor: 'rgba(138, 138, 133, 0.3)',
        color: '#8A8A85',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div ref={blockRef} className="mt-16 pt-8 border-t border-[#8A8A85]/20">
      <p className="skills-title section-label mb-8">
        <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
          Core Skills
        </TextScrambleWithHover>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {skillCategories.map((category, catIndex) => (
          <div key={catIndex} className="skill-category">
            <h4 className="body-mono text-[#1A1A1A] mb-4 text-sm font-medium">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {category.title}
              </TextScrambleWithHover>
            </h4>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="body-mono px-4 py-2 border border-[#8A8A85]/30 text-[#8A8A85] cursor-default"
                  onMouseEnter={(e) => handleSkillHover(e, true)}
                  onMouseLeave={(e) => handleSkillHover(e, false)}
                >
                  <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                    {skill}
                  </TextScrambleWithHover>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Tools Section */}
      <div className="pt-8 border-t border-[#8A8A85]/10">
        <p className="skills-title section-label mb-8">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
            AI Tools
          </TextScrambleWithHover>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aiCategories.map((category, catIndex) => (
            <div key={catIndex} className="skill-category">
              <h4 className="body-mono text-[#1A1A1A] mb-4 text-sm font-medium">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {category.title}
                </TextScrambleWithHover>
              </h4>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="body-mono px-4 py-2 border border-[#8A8A85]/30 text-[#8A8A85] cursor-default"
                    onMouseEnter={(e) => handleSkillHover(e, true)}
                    onMouseLeave={(e) => handleSkillHover(e, false)}
                  >
                    <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                      {skill}
                    </TextScrambleWithHover>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonalInfoBlock() {
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    if (!block) return;

    const elements = block.querySelectorAll('.info-item');
    const titleEl = block.querySelector('.block-title');

    gsap.set(titleEl, { y: 30, opacity: 0 });
    gsap.set(elements, { y: 40, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(titleEl, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    }).to(
      elements,
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === block) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={blockRef} className="flex-1 min-w-[280px]">
      {/* Block Title */}
      <div className="block-title flex items-center gap-3 mb-8 pb-4 border-b border-[#8A8A85]/30">
        <User className="w-5 h-5 text-[#FF3D00]" strokeWidth={1.5} />
        <h3 className="section-label text-[#1A1A1A]">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
            PERSONAL INFO · 个人信息
          </TextScrambleWithHover>
        </h3>
      </div>

      {/* Info Items */}
      <div className="space-y-5">
        {personalInfo.map((item, index) => (
          <div
            key={index}
            className="info-item group cursor-default"
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="w-3.5 h-3.5 text-[#8A8A85] group-hover:text-[#FF3D00] transition-colors" strokeWidth={1.5} />
              <span className="work-index text-[#8A8A85] group-hover:text-[#FF3D00] transition-colors">
                <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                  {item.label}
                </TextScrambleWithHover>
              </span>
            </div>
            <p className="body-mono text-[#1A1A1A] pl-5.5 group-hover:text-[#FF3D00] transition-colors">
              <TextScrambleWithHover duration={0.5} speed={0.03} trigger={true}>
                {item.value}
              </TextScrambleWithHover>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const title = header.querySelector('h2');
    const subtitle = header.querySelectorAll('.subtitle-line');

    gsap.set(title, { y: 60, opacity: 0 });
    gsap.set(subtitle, { y: 30, opacity: 0 });

    // 使用ScrollTrigger检测进入视口，每次进入都触发
    ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(title, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
    }).to(
      subtitle,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-full relative flex flex-col justify-center py-24 px-6 md:px-12 lg:px-24"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-[1600px] mx-auto w-full">
      {/* Section Header */}
      <div ref={headerRef} className="mb-16 md:mb-24">
        <h2 className="display-giant text-5xl md:text-7xl lg:text-8xl mb-6">
          <TextScrambleWithHover duration={1.0} speed={0.03} trigger={isInView}>
            ABOUT ME
          </TextScrambleWithHover>
        </h2>
        <p className="subtitle-line body-mono text-[#8A8A85] max-w-xl">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            3D Modeling · Level Design · Blueprint · Stylized Art
          </TextScrambleWithHover>
        </p>
        <p className="subtitle-line body-mono text-[#8A8A85]/60 mt-2 text-xs">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={isInView}>
            建模 · 地编 · 蓝图开发 · 风格化着色器
          </TextScrambleWithHover>
        </p>
      </div>

      {/* Three Column Layout - Personal Info, Education, Experience */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-12">
        <PersonalInfoBlock />
        <TimelineBlock
          title="EDUCATION · 教育"
          icon={GraduationCap}
          items={educationData}
          delay={0.1}
        />
        <TimelineBlock
          title="EXPERIENCE · 经历"
          icon={Briefcase}
          items={experienceData}
          delay={0.2}
        />
      </div>

      {/* Awards - Separate Section */}
      <AwardsBlock />

      {/* Skills Tags - Categorized with GSAP hover glow */}
      <SkillsBlock />
      </div>
    </section>
  );
}
