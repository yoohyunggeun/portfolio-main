"use client";

import { useActionState } from "react";
import { manageRecipient } from "@/server/access/recipients";

type Recipient = { id: string; email?: string; company: string; application: string; contact: string; posting: string; memo: string };

export function RecipientForm({ recipient, remote }: { recipient?: Recipient; remote?: boolean }) {
  const [message, action, pending] = useActionState(manageRecipient, "");
  return <form action={action} className="access-card">
    <input type="hidden" name="operation" value={recipient ? "edit" : "register"} />
    {recipient && <input type="hidden" name="id" value={recipient.id} />}
    <label>회사명<input name="company" defaultValue={recipient?.company} required maxLength={100} /></label>
    {remote && <label>수신 이메일<input name="email" type="email" defaultValue={recipient?.email} required={!recipient} maxLength={254} /></label>}
    {(!remote || recipient) && <>
    <label>지원 건<input name="application" defaultValue={recipient?.application} required={!remote} maxLength={120} /></label>
    <label>담당자<input name="contact" defaultValue={recipient?.contact} maxLength={120} /></label>
    <label>지원 공고 URL<input name="posting" type="url" defaultValue={recipient?.posting} maxLength={500} /></label>
    <label>메모<textarea name="memo" defaultValue={recipient?.memo} maxLength={1000} /></label>
    </>}
    <button className="button primary" disabled={pending}>{pending ? "저장 중…" : recipient ? "대상 정보 저장" : "대상 등록"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}

export function RevokeRecipient({ id }: { id: string }) {
  const [message, action, pending] = useActionState(manageRecipient, "");
  return <details className="access-card">
    <summary>대상 전체 접근 취소</summary>
    <form action={action} className="access-card">
      <input type="hidden" name="operation" value="revoke" /><input type="hidden" name="id" value={id} />
      <p className="muted">이 대상의 모든 초대 링크와 유효 세션을 취소합니다.</p>
      <button className="button" disabled={pending}>전체 취소 적용</button>
      {message && <p role="status">{message}</p>}
    </form>
  </details>;
}
