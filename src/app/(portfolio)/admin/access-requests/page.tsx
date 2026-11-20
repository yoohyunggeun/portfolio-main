import Link from "next/link";
import { AdminNav } from "@/components/access/admin-nav";
import { redirect } from "next/navigation";
import { FocusHeading } from "@/components/access/focus-heading";
import { DecisionForm, InviteLink } from "@/components/access/forms";
import { db, resource, sessionExpiry } from "@/server/access/local";

type Row = { id: string; company: string; email: string; status: "pending" | "approved" | "rejected"; created: number; invite: string | null; used: number | null; invite_until: number | null; cancelled: number | null; reusable: number };
const statusLabel = { pending: "검토 대기", approved: "승인 완료", rejected: "거절 완료" };

export default async function Requests({ searchParams }: { searchParams: Promise<{ status?: string; request?: string }> }) {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  const query = await searchParams;
  const status = query.status === "processed" ? "processed" : "pending";
  const { list, springAccess, epoch } = await import("@/server/access/backend");
  const remote = springAccess();
  const rows: Row[] = remote ? (await list<import("@/server/access/backend").RequestRow>("requests"))
    .map(row => ({ ...row, created: epoch(row.created_at), invite: null, used: null, invite_until: null, cancelled: null, reusable: 0 }))
    .sort((a, b) => b.created - a.created)
    : db().prepare("SELECT * FROM requests ORDER BY created DESC, rowid DESC").all() as unknown as Row[];
  const shown = rows.filter((row) => (row.status === "pending") === (status === "pending"));
  const selected = shown.find((row) => row.id === query.request);
  return <section className="page-section access-shell">
    <AdminNav current="access-requests" /><p className="eyebrow">CAREER × CODE / ADMIN</p>{selected ? <FocusHeading key={selected.id + selected.status}>{selected.status === "pending" ? "요청 상세" : statusLabel[selected.status]}</FocusHeading> : <h1>열람 요청</h1>}
    <nav className="concept-tabs" aria-label="요청 상태">
      <Link aria-current={status === "pending" ? "page" : undefined} href="/admin/access-requests">대기 {rows.filter((row) => row.status === "pending").length}</Link>
      <Link aria-current={status === "processed" ? "page" : undefined} href="/admin/access-requests?status=processed">처리 완료</Link>
    </nav>
    {selected ? <article key={selected.id + selected.status} className={`panel concept-card access-card ${selected.status === "pending" ? "access-transition" : "access-result"}`}>
      <h2>{selected.company}</h2>
      <dl><dt>수신 이메일</dt><dd>{selected.email}</dd><dt>자료</dt><dd>{remote ? "전체 보호 자료" : resource.title}</dd><dt>상태</dt><dd>{statusLabel[selected.status]}</dd></dl>
      {selected.status === "pending" && <><p className="muted">최초 열람 · 시작 후 1시간</p><DecisionForm id={selected.id} /></>}
      {selected.status === "approved" && selected.invite && (selected.cancelled || (selected.used && !selected.reusable) || (selected.invite_until ?? 0) <= Date.now() / 1000
        ? <p role="status">{selected.cancelled ? "초대 링크가 취소되었습니다." : selected.used && !selected.reusable ? "초대 링크를 사용했습니다." : "초대 링크가 만료되었습니다."}</p>
        : <><p role="status">열람 링크가 발급되었습니다.</p><InviteLink path={`/invite/${selected.invite}`} /></>)}
      <Link className="text-link" href={`/admin/access-requests?status=${status}`}>← 요청 목록</Link>
    </article> : !shown.length ? <div className="panel concept-card access-card">
      <h2>{rows.length ? "조건에 맞는 요청이 없습니다." : "아직 열람 요청이 없습니다."}</h2>
      {rows.length ? <Link href="/admin/access-requests" className="text-link">필터 초기화</Link>
        : <a href={`/admin/access-requests?status=${status}`} className="text-link">목록 새로고침</a>}
    </div>
      : <ul className="access-card">{shown.map((row) => <li key={row.id} className="panel concept-card">
        <h2>{row.company}</h2><p className="muted">{remote ? "전체 보호 자료" : resource.title}</p>
        <p className="muted">{new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Seoul" }).format(row.created * 1000)} · {statusLabel[row.status]}</p>
        <Link className="text-link" href={`/admin/access-requests?status=${status}&request=${row.id}`}>요청 상세 보기 →</Link>
      </li>)}</ul>}
  </section>;
}
