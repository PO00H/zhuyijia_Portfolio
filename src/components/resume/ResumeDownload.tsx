import { useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { RESUME_FILES, type ResumeFile } from '@/data/resume';
import './resume-download.css';

interface ResumeDownloadProps {
  variant?: 'hero' | 'contact';
}

export function ResumeDownload({ variant = 'hero' }: ResumeDownloadProps) {
  const available = RESUME_FILES.filter((file) => file.available);
  const [selectedId, setSelectedId] = useState(available[0]?.id ?? '');
  const selected = available.find((file) => file.id === selectedId) ?? available[0];

  if (!selected) return null;

  if (available.length === 1) {
    return variant === 'contact' ? (
      <a
        href={selected.path}
        download={selected.downloadName}
        className="portfolio-contact-card portfolio-contact-link"
      >
        <span className="portfolio-contact-label">
          <FileText aria-hidden="true" />
          简历 / RESUME
        </span>
        <strong>{selected.label}</strong>
        <ArrowUpRight className="portfolio-contact-arrow" aria-hidden="true" />
      </a>
    ) : (
      <a
        href={selected.path}
        download={selected.downloadName}
        className="portfolio-secondary-action"
      >
        下载个人简历
      </a>
    );
  }

  return variant === 'contact' ? (
    <div className="portfolio-contact-card resume-download-with-switch">
      <span className="portfolio-contact-label">
        <FileText aria-hidden="true" />
        简历 / RESUME
      </span>
      <div className="resume-download-row">
        <div className="resume-download-options" role="group" aria-label="选择简历语言">
          {available.map((file: ResumeFile) => (
            <button
              key={file.id}
              type="button"
              className={file.id === selected.id ? 'is-active' : ''}
              onClick={() => setSelectedId(file.id)}
              aria-pressed={file.id === selected.id}
            >
              {file.label}
            </button>
          ))}
        </div>
        <a
          href={selected.path}
          download={selected.downloadName}
          className="resume-download-link"
          aria-label={`下载 ${selected.label} 简历`}
        >
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </div>
  ) : (
    <div className="portfolio-secondary-action resume-download-hero">
      <div className="resume-download-options" role="group" aria-label="选择简历语言">
        {available.map((file: ResumeFile) => (
          <button
            key={file.id}
            type="button"
            className={file.id === selected.id ? 'is-active' : ''}
            onClick={() => setSelectedId(file.id)}
            aria-pressed={file.id === selected.id}
          >
            {file.label}
          </button>
        ))}
      </div>
      <a
        href={selected.path}
        download={selected.downloadName}
        className="resume-download-link"
        aria-label={`下载 ${selected.label} 简历`}
      >
        下载
      </a>
    </div>
  );
}
