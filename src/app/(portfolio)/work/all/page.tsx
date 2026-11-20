import Link from "next/link";
import { paginate, Pagination } from "@/components/projects/pagination";
import { WorkRecordGrid } from "@/components/projects/work-record-grid";
import { workRecords, workRoles } from "@/content/projects/work-records";
import { sessionExpiry } from "@/server/access/local";

export const metadata = { title: "전체 실무 기록" };

type Params = { q?: string | string[]; type?: string | string[]; page?: string | string[] };
const normalize = (value: string) => value.normalize("NFKC").toLowerCase().replace(/\s+/g, "");

export default async function WorkPage({ searchParams }: { searchParams: Promise<Params> }) {
  const { q, type, page } = await searchParams;
  const admin = Boolean(await sessionExpiry("admin"));
  const query = typeof q === "string" ? q.trim().slice(0, 100) : "";
  const active = workRoles.find(({ id }) => id === type);
  const term = normalize(query);
  const filtered = (await workRecords(admin)).filter((record) =>
    (!active || record.roles.includes(active.id))
      && [record.title, record.organization ?? ""].some((field) => normalize(field).includes(term))
  );
  const results = paginate(filtered, page);

  function href(role = "", nextPage = 1) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (role) params.set("type", role);
    if (nextPage > 1) params.set("page", String(nextPage));
    return params.size ? `/work/all?${params}` : "/work/all";
  }

  return <section className="page-section">
    <h1>전체 실무 기록</h1>
    <p className="lede">담당한 작업을 먼저 읽고 {admin ? "기관명·사업명" : "사업명"}이나 역할로 필요한 사례를 찾을 수 있습니다.</p>
    <div className="work-record-controls">
      <form action="/work/all" className="demo-actions work-search" role="search">
        <input type="search" name="q" aria-label={admin ? "기관명 또는 사업명 검색" : "사업명 검색"}
          placeholder={admin ? "기관명 또는 사업명 검색" : "사업명 검색"} maxLength={100} defaultValue={query} key={query} />
        {active && <input type="hidden" name="type" value={active.id} />}
        <button className="button" type="submit">검색</button>
      </form>
      <nav className="concept-tabs" aria-label="업무 유형 필터">
        <Link href={href()} aria-current={!active ? "true" : undefined}>전체</Link>
        {workRoles.map(({ id, label }) => <Link key={id} href={href(id)} scroll={false}
          aria-current={active?.id === id ? "true" : undefined}>{label}</Link>)}
      </nav>
    </div>
    <p className="muted list-count" role="status">{query || active ? "검색 결과" : "전체"} {filtered.length}개
      {filtered.length > 0 && ` · ${results.start + 1}–${results.end}번째`}</p>
    {filtered.length ? <WorkRecordGrid records={results.items} /> : <p className="panel concept-card">조건에 맞는 실무 기록이 없습니다.</p>}
    <Pagination {...results} href={(number) => href(active?.id, number)} />
    <Link href="/work" className="text-link">← 실무 프로젝트</Link>
  </section>;
}
