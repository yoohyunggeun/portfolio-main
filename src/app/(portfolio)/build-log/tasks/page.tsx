import Link from "next/link";
import { TaskList } from "@/components/build-log/task-list";
import { phases, statuses } from "@/content/build-log/tasks";
import { currentTasks as tasks } from "@/content/build-log/releases";

export const metadata = { title: "전체 작업 목록" };

function filterHref(phase: string, status: string) {
  const query = new URLSearchParams();
  if (phase) query.set("phase", phase);
  if (status) query.set("status", status);
  return query.size
    ? "/build-log/tasks?" + query.toString()
    : "/build-log/tasks";
}

export default async function BuildTasks({
  searchParams,
}: {
  searchParams: Promise<{
    phase?: string | string[];
    status?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const phase = phases.find((value) => value === query.phase) ?? "";
  const status = statuses.find((value) => value === query.status) ?? "";
  const shown = tasks.filter(
    (task) =>
      (!phase || task.phase === phase) && (!status || task.status === status),
  );

  return (
    <section className="page-section">
      <Link className="text-link" href="/build-log">
        ← 제작 과정 요약
      </Link>
      <p className="eyebrow">BUILD LOG / ALL TASKS</p>
      <h1>전체 작업 목록</h1>
      <p className="lede">
        설계부터 첫 공개, 개별 백엔드·AI 확장까지 공개용 로드맵을 모았습니다.
      </p>
      <p className="muted">
        현재 상태는 2026-11-24 운영 확인을 반영합니다.{" "}
        <Link className="text-link" href="/build-log#legacy-local-history">
          기존 작업의 당시 상태와 원문은 보존 이력에서 볼 수 있습니다.
        </Link>
      </p>
      <nav className="concept-tabs log-filters" aria-label="단계 필터">
        {["", ...phases].map((value) => (
          <Link
            key={value}
            href={filterHref(value, status)}
            scroll={false}
            aria-current={value === phase ? "true" : undefined}
          >
            {value || "전체 단계"}
          </Link>
        ))}
      </nav>
      <nav className="concept-tabs log-filters" aria-label="상태 필터">
        {["", ...statuses].map((value) => (
          <Link
            key={value}
            href={filterHref(phase, value)}
            scroll={false}
            aria-current={value === status ? "true" : undefined}
          >
            {value || "전체 상태"}
          </Link>
        ))}
      </nav>
      <section className="panel concept-card log-block" aria-label="필터 결과">
        <div className="section-heading">
          <p role="status">작업 {shown.length}개</p>
          {(phase || status) && (
            <Link className="text-link" href="/build-log/tasks" scroll={false}>
              필터 초기화
            </Link>
          )}
        </div>
        <div
          key={shown.map(({ id }) => id).join(",")}
          className="log-filter-results"
        >
          {shown.length ? (
            <TaskList items={shown} showPhase />
          ) : (
            <p className="muted">조건에 맞는 작업이 없습니다.</p>
          )}
        </div>
      </section>
    </section>
  );
}
