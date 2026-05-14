import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextScrambleWithHover } from '@/components/ui/text-scramble';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const cornerLeftRef = useRef<HTMLDivElement>(null);
  const cornerRightRef = useRef<HTMLDivElement>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const title = titleRef.current;
    const name = nameRef.current;
    const subtitle = subtitleRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    const cornerLeft = cornerLeftRef.current;
    const cornerRight = cornerRightRef.current;

    if (!title || !name || !subtitle || !scrollIndicator || !cornerLeft || !cornerRight) return;

    // Initial state - 从下往上动画
    gsap.set(title, { y: 60, opacity: 0 });
    gsap.set(name, { y: 40, opacity: 0 });
    gsap.set(subtitle.children, { y: 30, opacity: 0 });
    gsap.set(scrollIndicator, { opacity: 0, y: 20 });
    gsap.set([cornerLeft, cornerRight], { opacity: 0 });

    // Entry animation timeline - 页面加载时自动播放
    const tl = gsap.timeline({ delay: 0.3 });

    // 在动画开始时触发文字打乱
    tl.add(() => setAnimationStarted(true))
      .to(title, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      })
      .to(
        name,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        subtitle.children,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        [cornerLeft, cornerRight],
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .to(
        scrollIndicator,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '-=0.1'
      );

    // Scroll-triggered fade out
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    scrollTl
      .to(title, {
        y: '-100%',
        opacity: 0,
        ease: 'none',
      })
      .to(
        name,
        {
          y: -50,
          opacity: 0,
          ease: 'none',
        },
        0
      )
      .to(
        subtitle.children,
        {
          y: -30,
          opacity: 0,
          stagger: 0.05,
          ease: 'none',
        },
        0
      )
      .to(
        [cornerLeft, cornerRight],
        {
          opacity: 0,
          ease: 'none',
        },
        0
      )
      .to(
        scrollIndicator,
        {
          opacity: 0,
          ease: 'none',
        },
        0
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
      id="portfolio"
      className="section-full relative flex flex-col justify-center items-center px-6"
      style={{ zIndex: 10 }}
    >
      {/* Main Title - 橙色大标题 1s */}
      <div className="text-center overflow-hidden">
        <h1
          ref={titleRef}
          className="display-giant text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter text-[#FF3D00]"
        >
          <TextScrambleWithHover 
            duration={1.0} 
            speed={0.03}
            trigger={animationStarted}
          >
            PORTFOLIO
          </TextScrambleWithHover>
        </h1>
      </div>

      {/* Name - 副标题 0.5s，字号等同于灰色小字 */}
      <div
        ref={nameRef}
        className="mt-6 md:mt-8"
      >
        <p className="body-mono text-[#FF3D00] text-sm md:text-base text-center">
          <TextScrambleWithHover 
            duration={0.5} 
            speed={0.03}
            trigger={animationStarted}
          >
            Zhu Yijia 朱翊嘉
          </TextScrambleWithHover>
        </p>
      </div>

      {/* Skills - 副标题 0.5s */}
      <div
        ref={subtitleRef}
        className="mt-6 md:mt-8 text-center"
      >
        <p className="body-mono text-[#8A8A85] text-sm md:text-base">
          <TextScrambleWithHover 
            duration={0.5} 
            speed={0.03}
            trigger={animationStarted}
          >
            3D MODELING 建模 · UE ENVIRONMENT ART 地编
          </TextScrambleWithHover>
        </p>
        <p className="body-mono text-[#8A8A85] text-sm md:text-base mt-2">
          <TextScrambleWithHover 
            duration={0.5} 
            speed={0.03}
            trigger={animationStarted}
          >
            UE BLUEPRINT 蓝图开发 · STYLIZED ART 风格化着色器
          </TextScrambleWithHover>
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span className="section-label text-[#8A8A85]">
          <TextScrambleWithHover duration={0.5} speed={0.03} trigger={animationStarted}>
            SCROLL
          </TextScrambleWithHover>
        </span>
        <div className="w-px h-16 md:h-20 bg-[#8A8A85]/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-6 bg-[#FF3D00] animate-scroll-line" />
        </div>
      </div>

      {/* Corner Labels */}
      <div ref={cornerLeftRef} className="absolute top-8 left-8 section-label text-[#8A8A85] z-20">
        <TextScrambleWithHover duration={0.5} speed={0.03} trigger={animationStarted}>
          PORTFOLIO
        </TextScrambleWithHover>
      </div>
      <div ref={cornerRightRef} className="absolute top-8 right-8 section-label text-[#8A8A85] z-20">
        <TextScrambleWithHover duration={0.5} speed={0.03} trigger={animationStarted}>
          2026
        </TextScrambleWithHover>
      </div>

      <style>{`
        @keyframes scroll-line {
          0% {
            transform: translateY(-150%);
          }
          100% {
            transform: translateY(400%);
          }
        }
        .animate-scroll-line {
          animation: scroll-line 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
