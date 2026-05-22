'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-20">
      <h1>에러발생: {error.message}</h1>
      <button type="button" onClick={reset}>
        다시 시도
      </button>
    </div>
  );
}
