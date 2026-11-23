"use client";

import { startTransition, useActionState, useState } from "react";
import Link from "next/link";
import { privacyVersion } from "@/content/privacy";
import { useRouter } from "next/navigation";
import { FocusHeading } from "./focus-heading";
import { decideRequest, submitRequest } from "@/server/access/actions";

export function RequestForm({ title }: { title: string }) {
  const [state, action, pending] = useActionState(submitRequest, {});
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  if (state.email) return <section className="panel concept-card access-card" aria-live="polite">
    <p className="eyebrow">REQUEST RECEIVED</p><FocusHeading>열람 요청을 접수했습니다</FocusHeading>
    <dl><dt>요청 자료</dt><dd>{title}</dd><dt>상태</dt><dd>검토 대기</dd><dt>수신 이메일</dt><dd>{state.email}</dd></dl>
    <p className="muted">승인 후 전달받은 링크에서 열람을 시작할 수 있습니다.</p>
    <Link className="button" href="/">홈으로 돌아가기</Link>
  </section>;
  return <form onSubmit={(event) => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  }} className="panel concept-card access-card" aria-busy={pending}>
    <Link className="text-link" href="/">← 홈으로</Link><h1>상세 자료 열람 요청</h1>
    <p className="muted">승인되면 초대 링크로 전체 보호 자료를 열람할 수 있습니다.</p>

    <aside className="privacy-request-notice" aria-label="개인정보 처리 안내"><p>회사명·이메일은 열람 요청 검토와 승인 링크 안내에 사용합니다. 대기 요청은 접수 후 30일, 거절 요청은 결정 후 30일, 승인 대상 정보는 제공 목적 종료와 최종 권한 종료가 모두 확인된 뒤 30일을 보관 기준으로 정했습니다. 기한이 지난 기록은 정기 정리 시 활성 권한과 종료 근거를 확인해 처리합니다.</p><Link className="text-link" href="/privacy">개인정보 안내 · 보관 기준과 문의 →</Link></aside>
    <label>회사명<input name="company" value={company} onChange={(event) => setCompany(event.target.value)} required maxLength={100} /></label>
    <label>수신 이메일<input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} /></label>
    <input type="hidden" name="privacyVersion" value={privacyVersion} />
    <p id="privacy-refusal" className="muted">동의를 거부할 수 있습니다. 동의하지 않으면 열람 요청을 접수할 수 없습니다. 일반 공개 페이지는 동의 없이 볼 수 있습니다.</p>
    <label className="privacy-consent"><input name="privacyConsent" type="checkbox" required aria-describedby="privacy-refusal" /> 개인정보 수집·이용에 동의합니다 (필수)</label>
    {!pending && state.error && <p className="access-result" role="alert">{state.error}</p>}
    <button className="button primary" disabled={pending}>{pending ? "요청 제출 중…" : state.error ? "다시 시도" : "열람 요청 제출"}</button>
    <p className="muted">승인 후 관리자가 열람 링크를 안내합니다.</p>
  </form>;
}

export function DecisionForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(decideRequest, {});
  const router = useRouter();
  if (state.processed) return <div className="access-card">
    <p role="status">{state.invite ? "열람 링크가 발급되었습니다." : "요청 처리를 완료했습니다."}</p>
    {state.invite && <InviteLink path={state.invite} />}
    <Link href="/admin/access-requests?status=processed">처리된 요청 목록 →</Link>
  </div>;
  return <form action={action} className="access-card" aria-busy={pending}>
    <input type="hidden" name="id" value={id} />
    <div className="demo-actions">
      <button className="button primary" name="decision" value="approved" disabled={pending || Boolean(state.error)}>승인 및 링크 발급</button>
      <button className="button" name="decision" value="rejected" disabled={pending || Boolean(state.error)}>요청 거절</button>
    </div>
    {pending && <p role="status">요청 처리 중… 권한과 처리 결과를 확인하고 있습니다.</p>}
    {!pending && state.error && <button type="button" className="button" onClick={() => {
      router.replace("/admin/access-requests");
      router.refresh();
    }}>요청 상태 다시 확인</button>}
    {!pending && state.error && <p className="access-result" role="alert">{state.error}</p>}
  </form>;
}

export function InviteLink({ path }: { path: string }) {
  const [notice, setNotice] = useState("");
  return <div className="access-card">
    <button className="button primary" onClick={async () => {
      try {
        await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
        setNotice("초대 링크를 복사했습니다.");
      } catch {
        setNotice("복사할 수 없습니다. 초대 화면을 열어 주소를 복사해 주세요.");
      }
    }}>초대 링크 복사</button>
    {notice && <p role="status">{notice}</p>}
    <Link href={path} prefetch={false} className="text-link">방문자 초대 화면 보기 →</Link>
  </div>;
}
