// src/renderer/features/history/useHistory.ts

import { useState, useEffect } from 'react';
import { BlogPost } from '../../types';

const STORAGE_KEY = 'blog_wizard_posts';

export function useHistory() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: BlogPost) => {
    setPosts(prev => [post, ...prev]);
  };

  const updatePost = (id: string, update: Partial<BlogPost>) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, ...update } : p)));
  };

  const removePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return { posts, addPost, updatePost, removePost };
}
