import Link from "next/link";

export function AdminNav({ current }: { current: string }) {
  const links = [
    ["dashboard", "대시보드"],
    ["settings", "자료 공개 범위"],
    ["access-requests", "열람 요청"],
    ["recipients", "초대 대상"],
    ["invitations", "초대 링크"],
    ["sessions", "열람 세션"],
  ];
  return (
    <div className="admin-toolbar">
      <nav className="concept-tabs" aria-label="관리자 메뉴">
        {links.map(([slug, label]) => (
          <Link
            key={slug}
            href={slug === "dashboard" ? "/admin" : `/admin/${slug}`}
            aria-current={current === slug ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
