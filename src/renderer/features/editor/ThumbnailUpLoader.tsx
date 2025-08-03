// src/renderer/features/editor/ThumbnailUploader.tsx

import React, { useRef } from 'react';

interface ThumbnailUploaderProps {
  thumbnail: string | null;
  setThumbnail: (url: string) => void;
}
export default function ThumbnailUploader({ thumbnail, setThumbnail }: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setThumbnail(url);
      // (티스토리 업로드: 업로드 API 연동 필요)
    }
  };

  return (
    <div>
      <label>
        썸네일 업로드:
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={inputRef}
          onChange={handleFile}
        />
        <button type="button" onClick={() => inputRef.current?.click()}>파일 선택</button>
      </label>
      {thumbnail && (
        <img src={thumbnail} alt="썸네일" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
      )}
    </div>
  );
}
