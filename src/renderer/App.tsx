// src/renderer/App.tsx

import React, { useState } from 'react';
import Editor from './features/editor/Editor';
import History from './features/history/History';
// import Settings from './features/settings/Settings'; // 필요시

const MENU = ['글쓰기', '히스토리'];

function App() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <header style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #eee' }}>
        {MENU.map((m, i) => (
          <button key={m} onClick={() => setTab(i)} style={{ fontWeight: tab === i ? 700 : 400 }}>{m}</button>
        ))}
      </header>
      <main style={{ padding: 32 }}>
        {tab === 0 && <Editor />}
        {tab === 1 && <History />}
      </main>
    </div>
  );
}

export default App;
