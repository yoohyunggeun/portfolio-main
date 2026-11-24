import Link from "next/link";

const pageSize = 6;

export function paginate<T>(items: readonly T[], value?: string | string[]) {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const requested =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 1;
  const page = Math.min(pages, Math.max(1, requested));
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, items.length);
  return { page, pages, start, end, items: items.slice(start, end) };
}

export function Pagination({
  page,
  pages,
  href,
}: {
  page: number;
  pages: number;
  href: (page: number) => string;
}) {
  if (pages < 2) return null;

  return (
    <nav className="concept-tabs list-pagination" aria-label="페이지 이동">
      {page > 1 && (
        <Link prefetch={false} href={href(page - 1)}>
          ← 이전
        </Link>
      )}
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <Link
          prefetch={false}
          key={number}
          href={href(number)}
          aria-label={`${number}페이지`}
          aria-current={page === number ? "page" : undefined}
        >
          {number}
        </Link>
      ))}
      {page < pages && (
        <Link prefetch={false} href={href(page + 1)}>
          다음 →
        </Link>
      )}
    </nav>
  );
}
