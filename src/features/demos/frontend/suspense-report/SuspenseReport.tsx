"use client";

import { Component, Suspense, use, useState, type ReactNode } from "react";

type Report = { title: string; detail: string };
type Request = { id: number; promise: Promise<Report> };

function loadReport(fail: boolean): Promise<Report> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (fail) reject(new Error("실습 보고서를 불러오지 못했어요."));
      else resolve({ title: "접근성 검토", detail: "키보드 이동과 포커스 표시를 확인했어요." });
    }, 900);
  });
}

class ReportBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return <p className="action-demo-feedback" data-status="retry" role="alert">
        보고서를 불러오지 못했어요. 다시 시도해 주세요.
      </p>;
    }
    return this.props.children;
  }
}

function ReportContent({ promise }: { promise: Promise<Report> }) {
  const report = use(promise);
  return <div role="status">
    <p className="promise-ready">불러오기 완료</p>
    <h3>{report.title}</h3>
    <p>{report.detail}</p>
  </div>;
}

export function SuspenseReport() {
  const [request, setRequest] = useState<Request | null>(null);

  function start(fail: boolean) {
    const promise = loadReport(fail);
    // Keep the original rejection readable by React even if the user leaves the demo.
    void promise.catch(() => {});
    setRequest((current) => ({ id: (current?.id ?? 0) + 1, promise }));
  }

  return <div className="panel concept-card demo-panel frontend-example">
    <h2>실습 보고서 불러오기</h2>
    <div className="demo-actions">
      <button type="button" className="button primary" onClick={() => start(false)}>
        {request ? "다시 불러오기" : "보고서 불러오기"}
      </button>
      <button type="button" className="button" onClick={() => start(true)}>실패 재현</button>
    </div>
    <div className="example-surface promise-report">
      {request ? <ReportBoundary key={request.id}>
        <Suspense fallback={<p role="status">보고서 불러오는 중…</p>}>
          <ReportContent promise={request.promise} />
        </Suspense>
      </ReportBoundary> : <p className="muted">버튼을 눌러 보고서를 요청하세요.</p>}
    </div>
  </div>;
}
