// src/renderer/features/editor/useEditorShortcuts.ts

import { useEffect } from 'react';

export function useEditorShortcuts({ onSave, onPublish }: { onSave: () => void, onPublish: () => void }) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        onPublish();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onPublish]);
}
