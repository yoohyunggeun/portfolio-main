import type { ReactNode } from "react";

export const companyKey = (value: string) => value.normalize("NFKC").trim().replace(/\s+/gu, " ");
export function CompanyGroups<T extends { id: string; company: string }>({ rows, created, render }: {
  rows: T[]; created: (row: T) => number; render: (row: T) => ReactNode;
}) {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const key = companyKey(row.company) || "회사 확인 필요";
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  const clock=(row:T)=>Number.isFinite(created(row))?created(row):0;
  const sorted = [...groups].map(([name, items]) => ({ name, items: items.sort((a,b) => clock(b)-clock(a) || b.id.localeCompare(a.id)) }));
  sorted.sort((a,b) => clock(b.items[0])-clock(a.items[0]) || a.name.localeCompare(b.name));
  return <div className="access-card company-groups">{sorted.map(({name,items}) => <section key={name} className="company-group access-card">
    <h3>{name} <small className="muted">{items.length}개 대상·기록</small></h3>
    {items.map(row => <div key={row.id}>{render(row)}</div>)}
  </section>)}</div>;
}
