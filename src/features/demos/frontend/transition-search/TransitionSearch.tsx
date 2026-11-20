"use client";

import { memo, useState, useTransition } from "react";

const topics = ["React", "CSS", "JavaScript", "TypeScript", "접근성", "애니메이션"];
const records = Array.from({ length: 3000 }, (_, index) => ({
  id: index + 1,
  title: `${topics[index % topics.length]} 실습 ${String(index + 1).padStart(4, "0")}`,
}));

// Skip the list when only the input or pending indicator changes.
const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  const term = query.trim().toLowerCase();
  const matches = records.filter(({ title }) => title.toLowerCase().includes(term));

  return <>
    <p role="status">검색 결과 {matches.length.toLocaleString("ko-KR")}개</p>
    {matches.length ? <div className="transition-results" role="region" aria-label="검색 결과 목록" tabIndex={0}>
      <ul className="detail-list">{matches.map(({ id, title }) => <li key={id}>{title}</li>)}</ul>
    </div> : <p className="muted">일치하는 실습이 없습니다.</p>}
  </>;
});

export function TransitionSearch() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  function updateSearch(value: string) {
    setInput(value);
    startTransition(() => setQuery(value));
  }

  return <div className="panel concept-card demo-panel frontend-example">
    <h2>3,000개 실습 검색</h2>
    <div className="demo-form">
      <label htmlFor="transition-search">검색어</label>
      <div className="demo-actions">
        <input id="transition-search" type="search" value={input} placeholder="예: React, 접근성"
          onChange={(event) => updateSearch(event.target.value)} />
      </div>
    </div>
    <div className="example-surface">
      <p className="muted transition-feedback" role="status">{pending ? "목록 갱신 중…" : ""}</p>
      <div aria-busy={pending}><SearchResults query={query} /></div>
    </div>
  </div>;
}
