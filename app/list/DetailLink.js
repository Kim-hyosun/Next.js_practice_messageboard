'use client';

import { useRouter } from 'next/navigation';

const DetailLink = () => {
  let router = useRouter();
  const handleClick = () => {
    router.push('/');
  };

  return <button onClick={handleClick}>버튼</button>;
};

export default DetailLink;
