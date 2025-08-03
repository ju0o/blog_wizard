// src/renderer/features/editor/CategoryTagInput.tsx

import React, { useState } from 'react';

export default function CategoryTagInput({ category, setCategory, tags, setTags }: {
  category: string; setCategory: (v: string) => void;
  tags: string[]; setTags: (v: string[]) => void;
}) {
  const [input, setInput] = useState('');
  return (
    <div style={{ margin: '8px 0' }}>
      <input
        placeholder="카테고리 입력"
        value={category}
        onChange={e => setCategory(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        placeholder="태그 추가 (쉼표로 구분)"
        value={input}
        onChange={e => setInput(e.target.value)}
        onBlur={() => {
          if (input.trim()) {
            setTags([...tags, ...input.split(',').map(t => t.trim()).filter(Boolean)]);
            setInput('');
          }
        }}
      />
      <div style={{ marginTop: 4 }}>
        {tags.map((tag, i) => (
          <span key={i} style={{ background: '#eee', padding: '2px 6px', borderRadius: 4, marginRight: 4 }}>
            {tag}
            <button style={{ marginLeft: 2, border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setTags(tags.filter((_, idx) => idx !== i))}>x</button>
          </span>
        ))}
      </div>
    </div>
  );
}
