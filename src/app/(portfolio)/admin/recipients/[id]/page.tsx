import { RecipientPurposeEnd } from "@/components/access/recipient-purpose-end-form";
import { RecipientLifecycle } from "@/components/access/recipient-lifecycle";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { RecipientList } from "@/components/access/recipient-list";
import { RecipientForm, RevokeRecipient } from "@/components/access/recipient-form";
import { db, now, sessionExpiry, validToken } from "@/server/access/local";
import { formatKst } from "@/server/access/time";

type Recipient = { id: string; company: string; application: string; contact: string; posting: string; memo: string; cancelled: number | null };

export default async function RecipientPage({ params }: { params: Promise<{ id: string }> }) {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  const { id } = await params;
  const { springAccess, apiId } = await import("@/server/access/backend");
  const remote = springAccess() ? await (await import("@/server/access/views")).accessLists() : null;
  if (!(remote ? apiId(id) : validToken(id))) notFound();
  const store = remote ? null : db();
  const target = remote?.targets.find(row => row.id === id);
  const recipient = remote ? target && { ...target, cancelled: target.cancelled ? 1 : null, contact: target.contact ?? "", posting: target.posting_url ?? "", memo: target.memo ?? "" }
    : store!.prepare("SELECT * FROM recipients WHERE id = ?").get(id) as Recipient | undefined;
  if (!recipient) notFound();
  const invites = remote ? remote.invitations.filter(row => row.recipient_id === id) : store!.prepare("SELECT id, created, invite_until, cancelled, used, reusable FROM requests WHERE recipient_id = ? ORDER BY created DESC, rowid DESC").all(id);
  const sessions = remote ? remote.readers.filter(row => row.recipient_id === id) : store!.prepare("SELECT s.id, s.started, s.recent, s.expires, s.ended FROM sessions s JOIN requests r ON r.id = s.request_id WHERE r.recipient_id = ? AND s.role = 'reader' ORDER BY s.started DESC").all(id);
  const time = now();
  const validSessions = sessions.filter((item) => !item.ended && Number(item.expires) > time).length;

  return <section className="page-section">
    <AdminNav current="recipients" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>초대 대상 관리</h1>
    <p className="lede">대상에 연결된 초대 링크와 세션을 확인합니다.</p>
    <div className="recipient-grid">
      <div className="access-card"><Link className="button" href="/admin/recipients">+ 대상 등록</Link><RecipientList current={id} /></div>
      <div className="access-card">
        <article className="panel concept-card access-card">
          <h2>{recipient.company}</h2><p>{recipient.application}</p>
          <dl>{remote && <><dt>수신 이메일</dt><dd>{target?.email || "미등록"}</dd></>}<dt>담당자</dt><dd>{recipient.contact || "미등록"}</dd><dt>지원 공고</dt><dd>{recipient.posting ? <a className="text-link" href={recipient.posting}>공고 열기 →</a> : "미등록"}</dd><dt>메모</dt><dd>{recipient.memo || "미등록"}</dd></dl>
          <p>연결된 초대 링크 {invites.length}개 · 유효 세션 {validSessions}개</p>
          {recipient.cancelled ? <p role="status">대상 전체 접근이 취소되었습니다.</p> : <>
            <Link className="button primary" href={`/admin/invitations?recipient=${id}`}>+ 초대 링크 생성</Link>
            {remote ? <RecipientLifecycle id={id} company={recipient.company} mode="revoke" /> : <RevokeRecipient id={id} />}
          </>}
          {remote && <RecipientPurposeEnd key={id} id={id} canEnd={target?.canEndPurpose === true && target.historyComplete === true && !target.purposeEndBlockedReason} endedAt={target?.purposeEndedAt ?? null} blockedReason={target?.purposeEndBlockedReason ?? "history_unknown"} neverIssued={target?.neverIssued === true} />}
          {remote && <RecipientLifecycle id={id} company={recipient.company} mode="delete" />}
          <details><summary>대상 정보 수정</summary><RecipientForm remote={!!remote} recipient={{ ...recipient, email: target?.email ?? "" }} /></details>
        </article>
        <section className="panel concept-card access-card">
          <h2>연결된 초대 링크</h2>
          {!invites.length && <p className="muted">연결된 링크가 없습니다.</p>}
          {invites.map((item) => <Link className="recipient-choice" key={String(item.id)} href={`/admin/invitations?recipient=${id}#invite-${item.id}`}>
            <strong>{item.cancelled ? "취소됨" : item.used && !item.reusable ? "사용됨" : Number(item.invite_until) <= time ? "만료" : "활성"}</strong>
            <span>발급 {formatKst(Number(item.created))} · 만료 {formatKst(Number(item.invite_until))} · {item.reusable ? "재사용 허용" : "1회 사용"} →</span>
          </Link>)}
        </section>
        <section className="panel concept-card access-card">
          <h2>연결된 열람 세션</h2>
          {!sessions.length && <p className="muted">연결된 세션이 없습니다.</p>}
          {sessions.map((item) => <Link className="recipient-choice" key={String(item.id)} href={`/admin/sessions?recipient=${id}#session-${item.id}`}>
            <strong>{item.ended ? "종료" : Number(item.expires) <= time ? "만료" : "유효"}</strong>
            <span>최초 {formatKst(Number(item.started))} · 만료 {formatKst(Number(item.expires))} →</span>
          </Link>)}
        </section>
      </div>
    </div>
  </section>;
}
