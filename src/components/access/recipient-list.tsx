import Link from "next/link";
import { db } from "@/server/access/local";
import { CompanyGroups } from "./company-groups";
import { formatKst } from "@/server/access/time";
export async function RecipientList({current,state="all"}:{current?:string;state?:string}) {
  const {springAccess,epoch}=await import("@/server/access/backend");
  type Row={id:string;company:string;application:string;email?:string|null;cancelled:boolean|number|null;purposeEndedAt?:string|null;created_at?:string;created?:number};
  const rows:Row[]=springAccess() ? (await(await import("@/server/access/views")).accessLists()).targets : db().prepare("SELECT id,company,application,cancelled,created FROM recipients ORDER BY created DESC,id DESC").all() as Row[];
  const selected=["active","inactive"].includes(state)?state:"all";
  const archived=(r:Row)=>Boolean(r.cancelled||r.purposeEndedAt);
  const shown=rows.filter(r=>selected === "all" || archived(r)===(selected === "inactive"));
  const created=(r:Row)=>r.created_at ? epoch(r.created_at) : r.created ?? 0;
  return <section className="panel concept-card access-card"><h2>대상 목록</h2>
    <nav className="concept-tabs admin-state-tabs" aria-label="대상 상태">{[["all","전체"],["active","진행 중"],["inactive","종료·보관"]].map(([s,label])=><Link key={s} href={`/admin/recipients?state=${s}`} aria-current={selected===s?"page":undefined}>{label}</Link>)}</nav>
    <p className="muted">보관은 표시 분류입니다. 접근 취소나 목적 종료만으로 대상 정보가 삭제되지 않습니다.</p>
    {!shown.length&&<p>해당 상태의 대상이 없습니다.</p>}
    <CompanyGroups rows={shown} created={created} render={row=><Link className="recipient-choice" href={`/admin/recipients/${row.id}`} aria-current={current===row.id?"page":undefined}>
      <strong>{row.email||"이메일 미등록"}</strong><span>{row.application||"지원 건 미등록"} · 대상 {row.id.slice(0,8)}</span>
      <small>등록 {created(row)>0?formatKst(created(row)):"시각 미확인"} · {row.cancelled?"접근 취소됨":row.purposeEndedAt?"목적 종료·보관":"진행 중"}</small>
    </Link>}/>
  </section>;
}
