'use client';

import Link from 'next/link';
export default function ListItem({ result, currentUser }) {
  const handleDelete = async (postId, event) => {
    try {
      /* await fetch(`api/test?mynameis=kim`) */
      /*  await fetch(`api/testabc/어쩔`); */
      /* fetch('/URL', { next: { revalidate: 60 } }) 캐싱 결과를 60초 동안만 보관하고 사용  */
      await fetch('/api/post/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })
        .then((r) => {
          if (r.status == 200) {
            return r.json();
          } else {
            //서버가 에러코드전송시 실행할코드
            return r.json({ message: '에러발생' });
          }
        })
        .then((result) => {
          //성공시 실행 할 코드
          event.target.parentElement.parentElement.style.opacity = 0;
          setTimeout(() => {
            event.target.parentElement.parentElement.remove();
          }, 200);
        })
        .catch((error) => {
          //인터넷문제 등으로 실패시 실행할코드
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {
        result.map((item) => (
          <div className="list-item" key={item._id}>
            <Link href={`/detail/${item._id}`}>
              <h4>{item.title}</h4>
              <span className="writer">
                {item.username ? '작성자: ' + item.username : ''}
              </span>
              <p>{item.content}</p>
            </Link>
            {currentUser === item.user ? (
              <div className="modify-buttons">
                <Link href={`/edit/${item._id}`}>✍🏻</Link>
                <div
                  onClick={(e) => handleDelete(item._id, e)}
                  style={{ cursor: 'pointer' }}>
                  🗑️
                </div>
              </div>
            ) : (
              ''
            )}

            {/*  <DetailLink /> */}
          </div>
        )) //return()과 {}중괄호 동시생략가능
      }
    </>
  );
}
