// src/renderer/features/editor/KeywordSuggest.tsx

import React from 'react';

export default function KeywordSuggest({ baseText, onSelect }: { baseText: string, onSelect: (kw: string) => void }) {
  // 실제론 API 활용, 지금은 간단 예시
  const mockKeywords = ['여행', '블로그', '후기', '추천', '꿀팁', '2024', '리뷰', '비교', '가이드'];
  const keywords = mockKeywords.filter(kw => baseText.includes(kw) === false);

  return (
    <div style={{ margin: '8px 0' }}>
      <b>키워드 추천:</b>
      {keywords.slice(0, 5).map(kw => (
        <button key={kw} onClick={() => onSelect(kw)} style={{ margin: '0 4px', background: '#eee' }}>{kw}</button>
      ))}
    </div>
  );
}
