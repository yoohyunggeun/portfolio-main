"use client";
import Link from "next/link";
import { useState } from "react";
import { areas, releases, type LogArea } from "@/content/build-log/releases";
import { tasks } from "@/content/build-log/tasks";
import { latestEntry } from "@/content/build-log/entries";
import { TaskList } from "./task-list";
export function BuildHistory() {
  const [area, setArea] = useState<LogArea>("전체");
  const dates = [...new Set(releases.map((release) => release.date))];
  return (
    <section className="build-history" aria-label="날짜별 제작 기록">
      <div className="concept-tabs history-filters" aria-label="제작 기록 분야">
        {areas.map((item) => (
          <button
            type="button"
            className="button"
            key={item}
            aria-pressed={area === item}
            onClick={() => setArea(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {dates.map((date, i) => (
        <details className="panel release-date" key={date} open={i === 0}>
          <summary>
            <time dateTime={date}>{date.replaceAll("-", ".")}</time>
            <span>
              {releases
                .filter((r) => r.date === date)
                .map((r) => r.title)
                .join(" · ")}
            </span>
          </summary>
          {releases
            .filter((r) => r.date === date)
            .map((release) => (
              <section
                key={release.id}
                id={release.id}
                className="release-section"
              >
                <div className="section-heading">
                  <h2>{release.title}</h2>
                  <span className="log-status">{release.status}</span>
                </div>
                {areas
                  .filter(
                    (a) => a !== "전체" && (area === "전체" || a === area),
                  )
                  .map((a) => {
                    const works = release.works.filter((w) => w.area === a);
                    return (
                      works.length > 0 && (
                        <details className="release-area" key={a} open>
                          <summary>
                            {a} · {works.length}개 작업
                          </summary>
                          {works.map((work) => (
                            <details
                              className="release-work"
                              key={work.id}
                              id={work.id}
                            >
                              <summary>{work.title}</summary>
                              <dl>
                                <dt>변경 배경</dt>
                                <dd>{work.background}</dd>
                                <dt>구현한 내용</dt>
                                <dd>{work.change}</dd>
                                <dt>버전·반영일</dt>
                                <dd>{work.version}</dd>
                                <dt>당시 검증 결과</dt>
                                <dd>{work.verified}</dd>
                                <dt>관련 변경</dt>
                                <dd>
                                  <Link
                                    className="text-link"
                                    href={work.related}
                                  >
                                    연결된 화면 보기 →
                                  </Link>
                                </dd>
                              </dl>
                            </details>
                          ))}
                        </details>
                      )
                    );
                  })}
              </section>
            ))}
        </details>
      ))}
      <details className="panel release-date" id="legacy-local-history">
        <summary>
          <span>이전 기록</span>
          <span>설계·로컬 구현 이력 · 기록일 미기재</span>
        </summary>
        <p className="muted">
          원본에 날짜·ID가 없는 요약은 날짜를 추정하지 않았습니다. 아래 상태는
          당시 기록이며, 현재 상태와 구분합니다.
        </p>
        <h2>{latestEntry.title}</h2>
        <dl>
          <dt>AI 지원</dt>
          <dd>{latestEntry.assistance}</dd>
          <dt>직접 검토</dt>
          <dd>{latestEntry.review}</dd>
          <dt>근거</dt>
          <dd>{latestEntry.evidence}</dd>
        </dl>
        <TaskList items={tasks} showPhase />
      </details>
    </section>
  );
}
