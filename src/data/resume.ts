export interface ResumeFile {
  id: string;
  /** 按钮/选择器上显示的文字 */
  label: string;
  /** 下载时提示的文件名 */
  downloadName: string;
  /** public/ 下的绝对路径 */
  path: string;
  /** 是否在界面中显示该选项 */
  available: boolean;
}

/**
 * 简历下载配置。
 * 只有 available === true 的条目才会出现在切换器中。
 * 新增语言/版本时：把 PDF 放进 public/documents/，在这里加一条即可。
 */
export const RESUME_FILES: ResumeFile[] = [
  {
    id: 'zh',
    label: '中文',
    downloadName: '朱翊嘉个人简历.pdf',
    path: '/documents/朱翊嘉个人简历.pdf',
    available: true,
  },
  // {
  //   id: 'en',
  //   label: 'English',
  //   downloadName: 'ZhuYijia_Resume.pdf',
  //   path: '/documents/ZhuYijia_Resume.pdf',
  //   available: false,
  // },
];
