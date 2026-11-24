import Link from "next/link";
import type { ReactNode } from "react";
export type GroupedAccessRow = {
  id: string;
  recipientId?: string;
  company: string;
  active: boolean;
  node: ReactNode;
};
export function GroupedAccessList({
  rows,
  state,
  href,
  openGroupId,
}: {
  rows: GroupedAccessRow[];
  state: string;
  href: (state: string) => string;
  openGroupId?: string;
}) {
  const selected = ["inactive", "all"].includes(state) ? state : "active";
  const groups = new Map<string, GroupedAccessRow[]>();
  for (const row of rows) {
    const key = row.recipientId ?? `unlinked:${row.id}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const visible = [...groups.entries()].filter(([, items]) =>
    items.some(
      (r) => selected === "all" || (selected === "active") === r.active,
    ),
  );
  return (
    <div className="access-card">
      <nav className="concept-tabs" aria-label="관리 항목 상태 필터">
        {[
          ["active", "활성"],
          ["inactive", "종료·취소·만료"],
          ["all", "전체"],
        ].map(([s, label]) => (
          <Link
            key={s}
            href={href(s)}
            aria-current={s === selected ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="muted">
        대상별 한 행으로 모아 표시합니다. 펼치면 링크·기기별 세션은 각각의
        기록으로 관리합니다.
      </p>
      {!visible.length && (
        <p className="panel concept-card">
          이 상태에 해당하는 항목이 없습니다.
        </p>
      )}
      {visible.map(([id, items]) => (
        <details
          key={id}
          open={openGroupId === id}
          className="panel concept-card access-card recipient-access-group"
        >
          <summary>
            <strong>{items[0].company}</strong>
            <small>
              {items[0].recipientId
                ? `대상 ${items[0].recipientId.slice(0, 8)}`
                : "대상 연결 확인 필요"}
            </small>
            <span>
              활성 {items.filter((r) => r.active).length} · 종료·취소·만료{" "}
              {items.filter((r) => !r.active).length}
            </span>
          </summary>
          <ul className="access-card">
            {items
              .filter(
                (r) =>
                  selected === "all" || (selected === "active") === r.active,
              )
              .map((r) => (
                <li key={r.id}>{r.node}</li>
              ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
