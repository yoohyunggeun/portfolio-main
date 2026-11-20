"use client";

import { useEffect, useState } from "react";

const entries = ["React", "React Hooks", "React 상태 관리", "JavaScript", "JavaScript 이벤트", "CSS 모션", "Web Animations API"];

function searchExamples(query: string, signal: AbortSignal): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // Short queries simulate slower responses so request ordering is easy to reproduce.
    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve(entries.filter((entry) => entry.toLowerCase().includes(query.toLowerCase())));
    }, query.length <= 2 ? 900 : 250);
    function abort() {
      window.clearTimeout(timer);
      reject(signal.reason);
    }
    signal.addEventListener("abort", abort, { once: true });
  });
}

export function AsyncSearch() {
  const [input, setInput] = useState("");
  const query = input.trim();
  const [result, setResult] = useState<{ query: string; entries: string[] } | null>(null);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    const debounce = window.setTimeout(async () => {
      try {
        const entries = await searchExamples(query, controller.signal);
        if (!controller.signal.aborted) setResult({ query, entries });
      } catch (error) {
        if (!controller.signal.aborted) throw error;
      }
    }, 250);
    return () => {
      window.clearTimeout(debounce);
      controller.abort();
    };
  }, [query]);

  const current = result?.query === query ? result.entries : null;

  return <div className="panel concept-card demo-panel frontend-example">
    <h2>기술 검색</h2>
    <p className="muted">짧은 검색어의 응답이 느린 상황을 브라우저에서 재현합니다.</p>
    <div className="demo-form">
      <label htmlFor="example-query">검색어</label>
      <div className="demo-actions"><input id="example-query" type="search" autoComplete="off"
        placeholder="예: React" value={input} onChange={(event) => {
          if (event.target.value.trim() !== query) setResult(null);
          setInput(event.target.value);
        }} /></div>
    </div>
    <div className="example-surface">
      <p role="status">{!query ? "검색어를 입력하세요." : current ? `검색 결과 ${current.length}개` : "검색 중…"}</p>
      {current && <ul className="detail-list">{current.map((entry) => <li key={entry}>{entry}</li>)}</ul>}
    </div>
  </div>;
}
