// src/renderer/features/history/History.tsx

import React, { useState } from 'react';
import { useHistory } from './useHistory';
import { BlogPost } from '../../types';

function History() {
  const { posts, removePost } = useHistory();
  const [selected, setSelected] = useState<BlogPost | null>(null);

  return (
    <div>
      <h2>작성한 글 히스토리</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id} style={{ marginBottom: 16 }}>
            <b>[{post.status === 'draft' ? '임시저장' : '발행'}]</b> {post.title}
            <button style={{ marginLeft: 8 }} onClick={() => setSelected(post)}>
              불러오기
            </button>
            <button style={{ marginLeft: 8 }} onClick={() => removePost(post.id)}>
              삭제
            </button>
            <span style={{ marginLeft: 8, color: '#999' }}>{new Date(post.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div style={{ border: '1px solid #eee', padding: 16, marginTop: 24 }}>
          <h3>미리보기: {selected.title}</h3>
          <div style={{ whiteSpace: 'pre-line' }}>{selected.content}</div>
          <button style={{ marginTop: 8 }} onClick={() => setSelected(null)}>
            닫기
          </button>
        </div>
      )}
    </div>
  );
}

export default History;
