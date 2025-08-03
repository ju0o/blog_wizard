// src/renderer/types/index.d.ts

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  platform: 'tistory' | 'naver';
  status: 'draft' | 'published';
}
