// src/renderer/features/editor/Editor.tsx

import React, { useState } from 'react';
import { useEditorShortcuts } from './useEditorShortcuts';
import ThumbnailUploader from './ThumbnailUploader';
import CategoryTagInput from './CategoryTagInput';
import KeywordSuggest from './KeywordSuggest';
import RichTextEditor from './RichTextEditor';

function Editor() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 임시저장
  const handleSave = () => {
    if (!title && !body) return;
    addPost({
      id: uuidv4(),
      title,
      content: body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      platform: format,
      status: 'draft',
    });
    setStatus('임시저장 완료!');
  };

  const handlePost = async () => {
    if (format === 'tistory') {
      setStatus('발행 중...');
      try {
        // window.electronAPI.tistoryPost는 preload에서 노출
        const result = await (window as any).electronAPI.tistoryPost({
          title,
          content: formattedBody,
        });
        if (result.status === 'ok') {
          addPost({
            id: uuidv4(),
            title,
            content: body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            platform: 'tistory',
            status: 'published',
          });
        }
        setStatus(result.status === 'ok' ? '티스토리 발행 성공!' : '실패');
      } catch (err) {
        setStatus('에러 발생!');
      }
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <h2>블로그 글쓰기</h2>
      <input
        type="text"
        placeholder="제목 입력"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', fontSize: 20, marginBottom: 16 }}
      />
      <ThumbnailUploader thumbnail={thumbnail} setThumbnail={setThumbnail} />
      <CategoryTagInput category={category} setCategory={setCategory} tags={tags} setTags={setTags} />
      <KeywordSuggest baseText={title + body} onSelect={kw => setTags([...tags, kw])} />
      <RichTextEditor value={body} onChange={setBody} />
      
      <textarea
        rows={15}
        placeholder="본문 입력"
        value={body}
        onChange={e => setBody(e.target.value)}
        style={{ width: '100%', fontSize: 16 }}
      />
      <div style={{ margin: '16px 0' }}>
        <label>
          <input
            type="radio"
            checked={format === 'tistory'}
            onChange={() => setFormat('tistory')}
          /> 티스토리
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            checked={format === 'naver'}
            onChange={() => setFormat('naver')}
          /> 네이버(복붙용)
        </label>
      </div>
      <button onClick={handleSave} style={{ marginRight: 8 }}>
        임시저장
      </button>
      <button onClick={handlePost} style={{ marginRight: 8 }}>
        {format === 'tistory' ? '티스토리 발행' : '복사(수동 발행)'}
      </button>
      <span style={{ marginLeft: 12 }}>{status}</span>

      <h3 style={{ marginTop: 32 }}>미리보기</h3>
      <div style={{ border: '1px solid #ddd', padding: 20, background: '#f9f9f9', minHeight: 200 }}>
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: formattedBody }} />
      </div>
    </div>
  );
}

export default Editor;
