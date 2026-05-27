import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/** 현재 페이지 주변으로 보여줄 페이지 번호 목록 (1, …, n-1, n, n+1, …, last) */
function buildPages(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);
  const sorted = [...pages].sort((a, b) => a - b);

  const out: (number | 'gap')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => `/list?page=${p}`;
  const pages = buildPages(currentPage, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="페이지네이션"
    >
      {/* 이전 */}
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          aria-label="이전 페이지"
        >
          <ChevronLeft />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'pointer-events-none opacity-40'
          )}
          aria-hidden
        >
          <ChevronLeft />
        </span>
      )}

      {/* 번호 */}
      {pages.map((p, i) =>
        p === 'gap' ? (
          <span
            key={`gap-${i}`}
            className="text-muted-foreground px-1 select-none"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              buttonVariants({
                variant: p === currentPage ? 'default' : 'ghost',
                size: 'icon',
              })
            )}
          >
            {p}
          </Link>
        )
      )}

      {/* 다음 */}
      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
          aria-label="다음 페이지"
        >
          <ChevronRight />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'pointer-events-none opacity-40'
          )}
          aria-hidden
        >
          <ChevronRight />
        </span>
      )}
    </nav>
  );
}
