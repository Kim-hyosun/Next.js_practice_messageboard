'use client';

import { useEffect, useState } from 'react';

export default function Comment({ postId }) {
  /* 댓글 게시요청 POST */
  let [comment, setComment] = useState('');
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/comment/new', {
        method: 'POST',
        body: JSON.stringify({ comment, postId }),
      });
      if (response.ok) {
        const result = await response.json();
        setComment(''); // 댓글 게시가 성공하면 input 필드 초기화
        setComments(result); //서버에서 다시 조회한 댓글리스트로 업데이트
      } else {
        console.error('댓글 게시 실패:', await response.text());
      }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  /* 댓글 조회요청 GET */
  let [comments, setComments] = useState([]);
  useEffect(() => {
    fetch(`/api/comment/get?postId=${postId}`, {
      method: 'GET',
    })
      .then((r) => r.json())
      .then((res) => {
        res.length > 0 ? setComments(res) : setComments('');
      });
  }, []);

  return (
    <>
      <hr />
      <div className="comment-box">
        <input
          type="text"
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>게시</button>
      </div>
      <div>
        {comments.length > 0
          ? comments.map((item) => (
              <p key={item._id.toString()}>
                <strong>{item.username}</strong>
                <br />
                <span>{item.content}</span>
              </p>
            ))
          : comments === ''
          ? '현재 댓글이 없습니다 첫 댓글을 달아보세요'
          : '댓글 로드중'}
      </div>
    </>
  );
}
