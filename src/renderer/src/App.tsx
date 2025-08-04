import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from './features/editor/Editor';
import { History } from './features/history/History';
import { Formatter } from './features/formatter/Formatter';
import { Button } from './components/ui/Button';
import { BlogPost, HistoryItem, AppSettings, FileData } from './types';
import { generateId, getCurrentTimestamp, storage } from './utils';
import { 
  FileText, 
  History as HistoryIcon, 
  Settings, 
  Download, 
  Upload,
  Plus
} from 'lucide-react';

type TabType = 'editor' | 'history' | 'formatter' | 'settings';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('editor');
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    editor: {
      autoSave: true,
      autoSaveInterval: 3000,
      theme: 'light',
      fontSize: 14,
      fontFamily: 'Inter',
    },
    platforms: {
      tistory: {
        accessToken: '',
        blogName: '',
        categoryId: '',
      },
      naver: {
        clientId: '',
        clientSecret: '',
        blogId: '',
      },
    },
    shortcuts: {
      save: 'Ctrl+S',
      publish: 'Ctrl+Enter',
      newPost: 'Ctrl+N',
    },
  });

  // 초기 데이터 로드
  useEffect(() => {
    const savedData = storage.get<FileData>('blog-wizard-data', {
      posts: [],
      settings,
      history: [],
      categories: [],
      tags: [],
      keywords: [],
      thumbnails: [],
    });

    setSettings(savedData.settings);
    setHistory(savedData.history);
  }, []);

  // 데이터 저장
  const saveData = useCallback(() => {
    const data: FileData = {
      posts: currentPost ? [currentPost] : [],
      settings,
      history,
      categories: [],
      tags: [],
      keywords: [],
      thumbnails: [],
    };
    storage.set('blog-wizard-data', data);
  }, [currentPost, settings, history]);

  // 자동 저장
  useEffect(() => {
    if (settings.editor.autoSave) {
      const interval = setInterval(saveData, settings.editor.autoSaveInterval);
      return () => clearInterval(interval);
    }
  }, [settings.editor.autoSave, settings.editor.autoSaveInterval, saveData]);

  // 새 포스트 생성
  const handleNewPost = useCallback(() => {
    const newPost: BlogPost = {
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
    };
    setCurrentPost(newPost);
    setCurrentTab('editor');
  }, []);

  // 포스트 저장
  const handleSavePost = useCallback((post: BlogPost) => {
    setCurrentPost(post);
    
    // 히스토리에 추가
    const historyItem: HistoryItem = {
      id: generateId(),
      postId: post.id,
      title: post.title,
      status: post.status,
      timestamp: getCurrentTimestamp(),
      content: post.content,
    };
    
    setHistory(prev => [historyItem, ...prev.slice(0, 99)]); // 최대 100개 유지
    saveData();
    
    alert('저장되었습니다.');
  }, [saveData]);

  // 포스트 발행
  const handlePublishPost = useCallback((post: BlogPost) => {
    const publishedPost = {
      ...post,
      status: 'published' as const,
      publishedAt: getCurrentTimestamp(),
    };
    
    setCurrentPost(publishedPost);
    handleSavePost(publishedPost);
    
    alert('발행되었습니다.');
  }, [handleSavePost]);

  // 히스토리 복원
  const handleRestoreHistory = useCallback((item: HistoryItem) => {
    const restoredPost: BlogPost = {
      id: generateId(),
      title: item.title,
      content: item.content,
      excerpt: '',
      category: '',
      tags: [],
      thumbnail: '',
      status: item.status,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    
    setCurrentPost(restoredPost);
    setCurrentTab('editor');
  }, []);

  // 히스토리 삭제
  const handleDeleteHistory = useCallback((itemId: string) => {
    setHistory(prev => prev.filter(item => item.id !== itemId));
    saveData();
  }, [saveData]);

  // 히스토리 보기
  const handleViewHistory = useCallback((content: string) => {
    // 미리보기 모달이나 새 탭에서 보기 기능 구현
    console.log('View content:', content);
  }, []);

  // 파일 내보내기
  const handleExport = useCallback(async () => {
    try {
      const data: FileData = {
        posts: currentPost ? [currentPost] : [],
        settings,
        history,
        categories: [],
        tags: [],
        keywords: [],
        thumbnails: [],
      };
      
      const result = await window.electronAPI.saveFileDialog({
        defaultPath: `blog-wizard-${new Date().toISOString().split('T')[0]}.json`,
      });
      
      if (!result.canceled && result.filePath) {
        const saveResult = await window.electronAPI.saveFile({
          filePath: result.filePath,
          content: data,
        });
        
        if (saveResult.success) {
          alert('파일이 성공적으로 내보내졌습니다.');
        } else {
          alert('파일 내보내기에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('파일 내보내기에 실패했습니다.');
    }
  }, [currentPost, settings, history]);

  // 파일 가져오기
  const handleImport = useCallback(async () => {
    try {
      const result = await window.electronAPI.selectFile();
      
      if (!result.canceled && result.filePaths.length > 0) {
        const loadResult = await window.electronAPI.loadFile(result.filePaths[0]);
        
        if (loadResult.success && loadResult.data) {
          const data: FileData = loadResult.data;
          setSettings(data.settings);
          setHistory(data.history);
          if (data.posts.length > 0) {
            setCurrentPost(data.posts[0]);
          }
          alert('파일이 성공적으로 가져와졌습니다.');
        } else {
          alert('파일 가져오기에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('파일 가져오기에 실패했습니다.');
    }
  }, []);

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            if (currentPost) {
              handleSavePost(currentPost);
            }
            break;
          case 'Enter':
            e.preventDefault();
            if (currentPost) {
              handlePublishPost(currentPost);
            }
            break;
          case 'n':
            e.preventDefault();
            handleNewPost();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPost, handleSavePost, handlePublishPost, handleNewPost]);

  // Electron 메뉴 이벤트
  useEffect(() => {
    const handleNewPostMenu = () => handleNewPost();
    const handleSavePostMenu = () => currentPost && handleSavePost(currentPost);
    const handlePublishPostMenu = () => currentPost && handlePublishPost(currentPost);

    window.electronAPI.onNewPost(handleNewPostMenu);
    window.electronAPI.onSavePost(handleSavePostMenu);
    window.electronAPI.onPublishPost(handlePublishPostMenu);

    return () => {
      window.electronAPI.removeAllListeners('new-post');
      window.electronAPI.removeAllListeners('save-post');
      window.electronAPI.removeAllListeners('publish-post');
    };
  }, [currentPost, handleNewPost, handleSavePost, handlePublishPost]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">Blog Wizard</h1>
            <div className="flex items-center space-x-1">
              <Button
                variant={currentTab === 'editor' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentTab('editor')}
                icon={<FileText className="w-4 h-4" />}
              >
                글쓰기
              </Button>
              <Button
                variant={currentTab === 'history' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentTab('history')}
                icon={<HistoryIcon className="w-4 h-4" />}
              >
                히스토리
              </Button>
              <Button
                variant={currentTab === 'formatter' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentTab('formatter')}
                icon={<Settings className="w-4 h-4" />}
              >
                포맷 변환
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewPost}
              icon={<Plus className="w-4 h-4" />}
            >
              새 글
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              icon={<Upload className="w-4 h-4" />}
            >
              가져오기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              icon={<Download className="w-4 h-4" />}
            >
              내보내기
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-hidden">
        {currentTab === 'editor' && (
          <Editor
            post={currentPost || undefined}
            onSave={handleSavePost}
            onPublish={handlePublishPost}
            onPreview={(content) => {
              // 미리보기 기능 구현
              console.log('Preview:', content);
            }}
          />
        )}
        
        {currentTab === 'history' && (
          <History
            history={history}
            onRestore={handleRestoreHistory}
            onDelete={handleDeleteHistory}
            onView={handleViewHistory}
          />
        )}
        
        {currentTab === 'formatter' && currentPost && (
          <Formatter
            post={currentPost}
            platformConfig={settings.platforms}
          />
        )}
        
        {currentTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">설정</h2>
            <p className="text-gray-600">설정 기능은 추후 구현 예정입니다.</p>
          </div>
        )}
      </main>

      {/* 상태 표시줄 */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>
              {currentPost ? `편집 중: ${currentPost.title || '제목 없음'}` : '새 글'}
            </span>
            <span>
              히스토리: {history.length}개
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>자동 저장: {settings.editor.autoSave ? '활성' : '비활성'}</span>
            <span>Ctrl+S: 저장 | Ctrl+Enter: 발행 | Ctrl+N: 새 글</span>
          </div>
        </div>
      </footer>
    </div>
  );
};