// 블로그 포스트 타입
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags: string[];
  thumbnail?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  platform?: 'tistory' | 'naver' | 'custom';
}

// 플랫폼별 포맷 설정
export interface PlatformConfig {
  tistory: {
    accessToken: string;
    blogName: string;
    categoryId?: string;
  };
  naver: {
    clientId: string;
    clientSecret: string;
    blogId: string;
  };
}

// 히스토리 항목 타입
export interface HistoryItem {
  id: string;
  postId: string;
  title: string;
  status: 'draft' | 'published';
  timestamp: string;
  content: string;
}

// 에디터 설정 타입
export interface EditorConfig {
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  theme: 'light' | 'dark';
  fontSize: number;
  fontFamily: string;
}

// 앱 설정 타입
export interface AppSettings {
  editor: EditorConfig;
  platforms: PlatformConfig;
  shortcuts: {
    save: string;
    publish: string;
    newPost: string;
  };
}

// 키워드 추천 타입 (수동만 허용)
export interface KeywordSuggestion {
  id: string;
  keyword: string;
  category: string;
  frequency: number;
  lastUsed: string;
}

// 썸네일 타입
export interface Thumbnail {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  color: string;
  postCount: number;
}

// 태그 타입
export interface Tag {
  id: string;
  name: string;
  color: string;
  postCount: number;
}

// 포맷 변환 결과 타입
export interface FormatResult {
  platform: 'tistory' | 'naver' | 'custom';
  content: string;
  metadata: Record<string, any>;
  success: boolean;
  error?: string;
}

// 파일 저장/로드 타입
export interface FileData {
  posts: BlogPost[];
  settings: AppSettings;
  history: HistoryItem[];
  categories: Category[];
  tags: Tag[];
  keywords: KeywordSuggestion[];
  thumbnails: Thumbnail[];
}