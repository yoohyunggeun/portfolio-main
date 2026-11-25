"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { readInvitationUrl } from "@/server/access/invitation-url";
import { InviteLink } from "./forms";
export function InvitationUrl({id,revision}:{id:string;revision:string}) {
  const [state,action,pending]=useActionState(readInvitationUrl,{});
  const [hidden,setHidden]=useState(false),result=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(!pending && (state.path||state.error))result.current?.focus();},[state,pending]);
  useEffect(()=>{const clear=()=>setHidden(true);window.addEventListener("portfolio:invitation-invalidated",clear);return()=>window.removeEventListener("portfolio:invitation-invalidated",clear);},[]);
  return <form action={action} onSubmit={()=>setHidden(false)} className="access-card" aria-busy={pending} data-link-revision={revision}>
    <input type="hidden" name="id" value={id}/>
    <button className="button" disabled={pending}>{pending?"유효 상태 확인 중…":"유효한 초대 URL 조회"}</button>
    {!pending && (state.error||state.path) && <div ref={result} tabIndex={-1} aria-label="초대 URL 조회 결과">
      {state.error ? <p role="alert">{state.error}</p> : !hidden && state.path ? <InviteLink path={state.path} expiresAt={state.expiresAt} retrievable/> : <p role="status">링크 상태가 변경되었습니다. 최신 상태를 다시 조회해 주세요.</p>}
    </div>}
  </form>;
}
