import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BlogPost } from '../../types';
import { generateId, getCurrentTimestamp, generateExcerpt } from '../../utils';
import { Save, Send, Eye } from 'lucide-react';

interface EditorProps {
  post?: BlogPost;
  onSave: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
  onPreview: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  post,
  onSave,
  onPublish,
  onPreview,
}) => {
  const [currentPost, setCurrentPost] = useState<BlogPost>(
    post || {
      id: generateId(),
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: [],
      thumbnail: '',
      status: 'draft',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    }
  );

  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Quill 에디터 설정
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'blockquote', 'code-block'
  ];

  // 자동 저장
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (currentPost.title || currentPost.content) {
        const updatedPost = {
          ...currentPost,
          updatedAt: getCurrentTimestamp(),
          excerpt: generateExcerpt(currentPost.content),
        };
        setCurrentPost(updatedPost);
      }
    }, 3000); // 3초마다 자동 저장

    return () => clearTimeout(autoSaveTimer);
  }, [currentPost.title, currentPost.content]);

  // 태그 추가
  const addTag = useCallback(() => {
    if (tagInput.trim() && !currentPost.tags.includes(tagInput.trim())) {
      setCurrentPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, currentPost.tags]);

  // 태그 제거
  const removeTag = useCallback((tagToRemove: string) => {
    setCurrentPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(() => {
    const updatedPost = {
      ...currentPost,
      updatedAt: getCurrentTimestamp(),
      excerpt: generateExcerpt(currentPost.content),
    };
    onSave(updatedPost);
  }, [currentPost, onSave]);

  // 발행 핸들러
  const handlePublish = useCallback(() => {
    const publishedPost = {
      ...currentPost,
      status: 'published' as const,
      updatedAt: getCurrentTimestamp(),
      publishedAt: getCurrentTimestamp(),
      excerpt: generateExcerpt(currentPost.content),
    };
    onPublish(publishedPost);
  }, [currentPost, onPublish]);

  // 미리보기 핸들러
  const handlePreview = useCallback(() => {
    onPreview(currentPost.content);
    setShowPreview(!showPreview);
  }, [currentPost.content, onPreview, showPreview]);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h1 className="text-xl font-semibold text-gray-900">글쓰기</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            icon={<Eye className="w-4 h-4" />}
          >
            미리보기
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            저장
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublish}
            icon={<Send className="w-4 h-4" />}
          >
            발행
          </Button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        {/* 제목 입력 */}
        <div>
          <Input
            label="제목"
            value={currentPost.title}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, title: e.target.value }))}
            placeholder="제목을 입력하세요..."
            className="text-lg font-medium"
          />
        </div>

        {/* 카테고리 및 태그 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="카테고리"
            value={currentPost.category || ''}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, category: e.target.value }))}
            placeholder="카테고리를 입력하세요..."
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              태그
            </label>
            <div className="flex items-center space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="태그를 입력하고 Enter..."
                className="flex-1"
              />
              <Button size="sm" onClick={addTag}>추가</Button>
            </div>
            {currentPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 썸네일 */}
        <div>
          <Input
            label="썸네일 URL"
            value={currentPost.thumbnail || ''}
            onChange={(e) => setCurrentPost(prev => ({ ...prev, thumbnail: e.target.value }))}
            placeholder="썸네일 이미지 URL을 입력하세요..."
            helperText="이미지 URL을 입력하거나 업로드 기능을 사용하세요"
          />
        </div>

        {/* 리치 텍스트 에디터 */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용
          </label>
          <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              theme="snow"
              value={currentPost.content}
              onChange={(content) => setCurrentPost(prev => ({ ...prev, content }))}
              modules={quillModules}
              formats={quillFormats}
              style={{ height: '100%' }}
              placeholder="내용을 입력하세요..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};