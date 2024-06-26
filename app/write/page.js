'use client';

import { useState } from 'react';

const Write = () => {
  let [imgsrc, setImgSrc] = useState('');
  let [imgName, setImgName] = useState('');
  return (
    <div className="p-20">
      <h4>글 작성</h4>
      <form action="/api/post/new" method="POST">
        <input type="text" name="title" placeholder="제목을 입력하세요 " />
        <input
          type="text"
          name="content"
          placeholder="글의 내용을 작성하세요"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            let file = e.target.files[0];
            let filename = encodeURIComponent(file.name);
            let res = await fetch(`/api/post/image?file=${filename}`);
            res = await res.json();

            //S3 업로드
            const formData = new FormData();
            Object.entries({ ...res.fields, file }).forEach(([key, value]) => {
              formData.append(key, value);
            });
            let 업로드결과 = await fetch(res.url, {
              method: 'POST',
              body: formData,
            });
            console.log(업로드결과);

            if (업로드결과.ok) {
              setImgSrc(업로드결과.url + '/' + filename);
              setImgName(file.name);
            } else {
              console.log('실패');
            }
          }}
        />
        {imgsrc ? (
          <input type="text" name="imgUrl" value={imgsrc} className="none" />
        ) : (
          ''
        )}
        <img src={imgsrc} alt={imgName} />
        <button type="submit">게시</button>
      </form>
    </div>
  );
};

export default Write;
