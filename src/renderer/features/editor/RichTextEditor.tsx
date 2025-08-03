// src/renderer/features/editor/RichTextEditor.tsx

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ header: [1, 2, 3, false] }],
          [{ list: 'ordered'}, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }}
      style={{ height: 300, marginBottom: 32 }}
    />
  );
}
