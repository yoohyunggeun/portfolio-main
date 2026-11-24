import Link from "next/link";
import type { ReactNode } from "react";
import { CompanyGroups } from "./company-groups";
export type GroupedAccessRow = {
  id: string;
  recipientId?: string;
  company: string;
  email?: string | null;
  application?: string | null;
  created?: number;
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
  const selected = ["inactive", "active"].includes(state) ? state : "all";
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
      <nav className="concept-tabs admin-state-tabs" aria-label="관리 항목 상태 필터">
        {[
          ["all", "전체"],
          ["active", "활성"],
          ["inactive", "종료·취소·만료"],
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
        회사는 표시용으로만 묶습니다. 이메일·지원 건·대상 키를 확인해 선택하세요.
        같은 회사여도 대상과 기기별 권한을 합치지 않습니다.
      </p>
      {!visible.length && (
        <p className="panel concept-card">
          이 상태에 해당하는 항목이 없습니다.
        </p>
      )}
      <CompanyGroups rows={visible.map(([id,items])=>({id,company:items[0].company,items}))}
        created={row=>row.items[0].created ?? 0} render={({id,items}) => (
        <details
          key={id}
          open={openGroupId === id}
          className="panel concept-card access-card recipient-access-group"
        >
          <summary>
            <strong>{items[0].company}</strong>
            <span>{items[0].email || "이메일 미등록"} · {items[0].application || "지원 건 미등록"}</span>
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
      )} />
    </div>
  );
}
