import Link from "next/link";
import { accessSession } from "@/server/access/session";
import { LockIcon } from "./lock-icon";

export async function ProjectLock() {
  const session = await accessSession();
  return (
    <section
      className="page-section project-lock"
      aria-labelledby="project-lock-title"
    >
      <p className="eyebrow">PROJECT ACCESS</p>
      <h1 id="project-lock-title">프로젝트 열람 권한이 필요합니다</h1>
      <p className="lede">
        승인된 범위에서 프로젝트 목록과 상세 자료를 확인할 수 있습니다.
      </p>
      <div className="panel concept-card lock-message">
        <span aria-hidden="true" className="lock-symbol">
          <LockIcon size={44} />
        </span>
        <h2>
          {session.unavailable
            ? "열람 상태를 확인할 수 없습니다"
            : session.role === "reader"
              ? "이 초대의 프로젝트 열람 범위를 확인해 주세요"
              : "승인 후 프로젝트를 열람할 수 있습니다"}
        </h2>
        <p className="muted">
          {session.role === "reader"
            ? "현재 초대에서 허용된 보호 자료는 열람 상태 화면에서 확인할 수 있습니다."
            : "현재 권한으로는 프로젝트 내용을 전달하지 않습니다. 열람 요청 후 안내받은 초대 링크를 사용해 주세요."}
        </p>
        <div className="actions">
          <Link href="/access" className="button primary">
            상세 자료 열람 요청 →
          </Link>
          <Link href="/access/status" className="button">
            열람 상태 확인
          </Link>
        </div>
      </div>
      <h2>공개 경력과 역량은 바로 볼 수 있어요.</h2>
      <div className="actions">
        <Link className="button" href="/experience">
          경력 살펴보기 →
        </Link>
        <Link className="button" href="/skills">
          기술 역량 보기 →
        </Link>
      </div>
    </section>
  );
}
