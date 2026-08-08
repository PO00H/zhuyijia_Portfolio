import { useState } from 'react';
import { Link } from 'react-router-dom';

import { sitePaths } from '../../app/routes';
import { profile } from '../../data/profile';
import { Reveal } from '../motion/Reveal';

type CopyState = 'idle' | 'copied' | 'failed';

export function ContactPanel() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const copyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(profile.publicContact.email);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  const copyLabel = copyState === 'copied' ? '已复制邮箱' : copyState === 'failed' ? '复制失败，请使用邮件链接' : profile.publicContact.email;
  const liveMessage = copyState === 'copied' ? '邮箱地址已复制到剪贴板。' : copyState === 'failed' ? '无法访问剪贴板，请使用发送邮件链接。' : '';

  return (
    <section className="archive-contact" id="contact" aria-labelledby="archive-contact-title">
      <Reveal className="archive-contact__inner">
        <span>[06 / ABOUT + CONTACT]</span>
        <p>游戏设计是主方向；程序与技术美术，是把玩法落实到手感和画面的方法。</p>
        <h2 id="archive-contact-title">一起做点<br />能玩的东西。</h2>
        <div>
          <button type="button" onClick={copyEmail} data-cursor="copy">{copyLabel}</button>
          <a href={`mailto:${profile.publicContact.email}`} data-cursor="read">发送邮件 ↗</a>
          <Link to={sitePaths.about} data-cursor="read">关于我 ↗</Link>
          <Link to={sitePaths.works} data-cursor="read">全部作品 ↗</Link>
        </div>
        <span className="archive-contact__copy-status" role="status" aria-live="polite">{liveMessage}</span>
      </Reveal>
    </section>
  );
}
