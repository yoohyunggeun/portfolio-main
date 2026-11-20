import Link from "next/link"; import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { InviteLink } from "@/components/access/forms";
import { ManageForm } from "@/components/access/management";
import { db, now, resource, sessionExpiry } from "@/server/access/local";
import { formatKst } from "@/server/access/time";

type Invite = { id: string; company: string; invite: string; invite_until: number; used: number | null; reusable: number; cancelled: number | null };

export default async function Invitations({ searchParams }: { searchParams: Promise<{ recipient?: string }> }) {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  const { recipient } = await searchParams;
  const { springAccess } = await import("@/server/access/backend");
  const remote = springAccess() ? await (await import("@/server/access/views")).accessLists() : null;
  const target = recipient ? remote ? remote.targets.find(row => row.id === recipient)
    : db().prepare("SELECT company, cancelled FROM recipients WHERE id = ?").get(recipient) : undefined;
  if (recipient && !target) redirect("/admin/recipients");
  const rows = remote ? remote.invitations.filter(row => !recipient || row.recipient_id === recipient) : db().prepare(`SELECT id, company, invite, invite_until, used, reusable, cancelled FROM requests
    WHERE invite IS NOT NULL AND (? IS NULL OR recipient_id = ?) ORDER BY created DESC, rowid DESC`)
    .all(recipient ?? null, recipient ?? null) as unknown as Invite[];

  return <section className="page-section">
    <AdminNav current="invitations" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>초대 링크 관리</h1>
    <p className="lede">링크의 사용 상태와 신규 열람을 시작할 수 있는 기한을 관리합니다.</p>
    {target && <Link className="text-link" href={`/admin/recipients/${recipient}`}>← {String(target.company)} 대상 상세</Link>}<div className="admin-columns">
      <ul className="access-card">
        {!rows.length && <li className="panel concept-card">발급된 초대 링크가 없습니다.</li>}
        {rows.map((row) => {
          const status = row.cancelled ? "취소됨" : row.used && !row.reusable ? "사용됨" : row.invite_until <= now() ? "만료" : "활성";
          return <li id={`invite-${row.id}`} key={row.id} className="panel concept-card access-card">
            <h2>{row.company}</h2>
            <dl><dt>만료 (KST)</dt><dd>{formatKst(row.invite_until)}</dd><dt>정책</dt><dd>{row.reusable ? "재사용 허용" : "1회 사용"}</dd><dt>상태</dt><dd>{status}</dd></dl>
            {status === "활성" && row.invite && <InviteLink path={`/invite/${row.invite}`} />}
            {(status === "활성" || !remote && status === "만료") && <details>
              <summary>기한 변경</summary>
              <ManageForm operation="extend-invite" id={row.id} label="링크 기한 연장">
                {remote ? <label>추가 일수<input type="number" name="days" min={1} max={30} required /></label> : <label>새 만료 시각 (KST)<input type="datetime-local" name="expiry" required /></label>}
              </ManageForm>
            </details>}
            {!row.cancelled && <ManageForm operation="cancel-invite" id={row.id} label="링크 취소" />}
          </li>;
        })}
      </ul>
      <aside className="panel concept-card access-card">
        <h2>새 초대 링크</h2><p className="muted">{resource.title} · 최초 열람 1시간</p>
        {target?.cancelled ? <p>접근이 취소된 대상입니다.</p> : <ManageForm operation="issue" label="링크 생성">
          {target ? <><p>초대 대상 · {String(target.company)}</p><input type="hidden" name="recipient" value={recipient} /></> : remote ? <><label>회사명<input name="company" maxLength={100} required /></label><label>수신 이메일<input name="email" type="email" required /></label></> : <label>초대 대상<input name="company" maxLength={100} required /></label>}
          {remote ? <label>유효 기간 (일)<input type="number" name="days" min={1} max={30} defaultValue={7} required /></label> : <label>링크 만료 시각 (KST)<input type="datetime-local" name="expiry" required /></label>}
          <label>재사용 정책<select name="policy" defaultValue="once"><option value="once">1회 사용</option><option value="reusable">재사용 허용</option></select></label>
        </ManageForm>
      }</aside>
    </div>
  </section>;
}
