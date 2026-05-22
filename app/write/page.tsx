'use client';

import { useState, type ChangeEvent } from 'react';
import Image from 'next/image';

interface PresignedPostResponse {
  url: string;
  fields: Record<string, string>;
}

export default function Write() {
  const [imgSrc, setImgSrc] = useState('');
  const [imgName, setImgName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const filename = encodeURIComponent(file.name);
      const presignRes = await fetch(`/api/post/image?file=${filename}`);
      if (!presignRes.ok) {
        const data = (await presignRes.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message ?? '업로드 URL 발급 실패');
      }
      const { url, fields } =
        (await presignRes.json()) as PresignedPostResponse;

      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      const uploadRes = await fetch(url, { method: 'POST', body: formData });
      if (!uploadRes.ok) throw new Error('S3 업로드 실패');

      setImgSrc(`${url}/${filename}`);
      setImgName(file.name);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-20">
      <h4>글 작성</h4>
      <form action="/api/post" method="POST">
        <input
          type="text"
          name="title"
          placeholder="제목을 입력하세요"
          required
        />
        <input
          type="text"
          name="content"
          placeholder="글의 내용을 작성하세요"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {imgSrc && (
          <input type="hidden" name="imgUrl" value={imgSrc} readOnly />
        )}
        {imgSrc && (
          <Image
            src={imgSrc}
            alt={imgName}
            width={320}
            height={240}
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        )}
        <button type="submit" disabled={uploading}>
          {uploading ? '업로드 중...' : '게시'}
        </button>
      </form>
    </div>
  );
}
