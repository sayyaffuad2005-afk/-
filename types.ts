
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface CurriculumFile {
  id: string;
  name: string;
  base64: string;
  type: string;
}

export interface TopicProgress {
  name: string;
  timestamp: number;
}

export interface Course {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  color: string;
  file?: CurriculumFile;
  chapters?: string[];
}

export enum AppView {
  HOME = 'HOME',
  COURSE_DETAIL = 'COURSE_DETAIL',
  CHAT = 'CHAT'
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  FILE_PROCESSING = 'FILE_PROCESSING',
  ERROR = 'ERROR'
}
