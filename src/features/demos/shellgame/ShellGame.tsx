"use client";

import { useRef, useState } from "react";
import { useStoredState } from "../use-stored-state";
import { ballPosition, recordGuess } from "./game";

type Round = { choice: number; ball: number; correct: boolean };
type Score = { played: number; wins: number; history: Round[] };
const emptyScore: Score = { played: 0, wins: 0, history: [] };

export function ShellGame() {
  const [score, setScore, ready] = useStoredState("career-code:shellgame:v1", emptyScore);
  const [result, setResult] = useState<Round | null>(null);
  const round = useRef<{ ball: number; answered: boolean } | null>(null);

  function choose(choice: number) {
    round.current ??= { ball: ballPosition(), answered: false };
    if (round.current.answered) return;
    const { ball } = round.current;
    round.current.answered = true;
    const correct = choice === ball;
    setResult({ choice, ball, correct });
    setScore((current) => ({
      played: current.played + 1,
      wins: current.wins + Number(correct),
      history: recordGuess(current.history, choice, ball),
    }));
  }

  function nextRound() {
    round.current = { ball: ballPosition(), answered: false };
    setResult(null);
  }

  return <div className="panel concept-card demo-panel">
    <h2>어느 컵에 공이 있을까요?</h2>
    <div className="cup-grid">
      {[0, 1, 2].map((cup) => <button type="button" className="cup-button" key={cup}
        disabled={!ready || result !== null} onClick={() => choose(cup)}>
        <span className="cup-shape" aria-hidden="true" />
        <span>{cup + 1}번 컵</span>
        {result?.ball === cup && <span className="ball-label">● 공</span>}
        {result?.choice === cup && result.ball !== cup && <span>선택</span>}
      </button>)}
    </div>
    <p role="status">{result ? `${result.correct ? "정답입니다." : "아쉽습니다."} 공은 ${result.ball + 1}번 컵에 있습니다.` : "컵 하나를 선택하세요."}</p>
    <div className="demo-actions">
      <button className="button primary" disabled={!result} onClick={nextRound}>다음 라운드</button>
      <button className="button" disabled={!ready || !score.played} onClick={() => { setScore(emptyScore); nextRound(); }}>기록 초기화</button>
    </div>
    <section aria-label="게임 기록">
      <h2>게임 기록</h2><p className="muted">총 {score.played}회 · 정답 {score.wins}회</p>
      <ol className="detail-list">{score.history.map((entry, index) =>
        <li key={score.played - index}>{score.played - index}회 · {entry.choice + 1}번 선택 · {entry.correct ? "정답" : `오답 (공: ${entry.ball + 1}번)`}</li>)}</ol>
    </section>
  </div>;
}
