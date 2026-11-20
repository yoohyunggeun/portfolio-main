"use client";

import { useEffect, useState } from "react";
import { useStoredState } from "../shared/use-stored-state";
import { randomCup, recordGuess, swapCups } from "./game";

type Round = { choice: number; ball: number; correct: boolean };
type Score = { played: number; wins: number; history: Round[] };
type Phase = "idle" | "reveal" | "cover" | "shuffle" | "choose" | "win" | "lose";
const emptyScore: Score = { played: 0, wins: 0, history: [] };
const cups = [0, 1, 2];

export function ShellGame() {
  const [score, setScore, ready] = useStoredState("career-code:shellgame:v1", emptyScore);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [{ order, pair }, setBoard] = useState<{ order: number[]; pair: number[] | null }>({ order: cups, pair: null });
  const [ballCup, setBallCup] = useState(0);
  const [pickedCup, setPickedCup] = useState<number | null>(null);
  const [completedSwaps, setCompletedSwaps] = useState(0);
  const swaps = 3 + level * 2;
  const speed = Math.max(150, 400 - level * 40);

  useEffect(() => {
    let advance: () => void;
    let delay: number;
    switch (phase) {
      case "reveal":
        advance = () => setPhase("cover");
        delay = 1000;
        break;
      case "cover":
        advance = () => {
          setBoard(swapCups(order, pair));
          setCompletedSwaps(1);
          setPhase("shuffle");
        };
        delay = 400;
        break;
      case "shuffle":
        advance = () => {
          if (completedSwaps === swaps) {
            setPhase("choose");
          } else {
            setBoard(swapCups(order, pair));
            setCompletedSwaps(completedSwaps + 1);
          }
        };
        delay = speed;
        break;
      case "win":
        advance = () => {
          setLevel(level + 1);
          setBallCup(randomCup());
          setPickedCup(null);
          setPhase("reveal");
        };
        delay = 1200;
        break;
      default:
        return;
    }
    const timer = window.setTimeout(advance, delay);
    return () => window.clearTimeout(timer);
  }, [phase, level, order, pair, completedSwaps, speed, swaps]);

  function start() {
    if (!ready || (phase !== "idle" && phase !== "lose")) return;
    setLevel(1);
    setBallCup(randomCup());
    setPickedCup(null);
    setPhase("reveal");
  }

  function choose(cup: number) {
    if (phase !== "choose") return;
    const choice = order.indexOf(cup);
    const ball = order.indexOf(ballCup);
    const correct = cup === ballCup;
    setPickedCup(cup);
    setPhase(correct ? "win" : "lose");
    setScore((current) => ({
      played: current.played + 1,
      wins: current.wins + Number(correct),
      history: recordGuess(current.history, choice, ball),
    }));
  }

  const messages: Record<Phase, string> = {
    idle: "시작을 누르고 공이 든 컵을 따라가세요.",
    reveal: "공 잘 봐",
    cover: "공 잘 봐",
    shuffle: "섞는 중…",
    choose: "공은 어느 컵?",
    win: "찾았다! 다음 레벨",
    lose: `꽝! 레벨 ${level}에서 끝 · 공은 ${order.indexOf(ballCup) + 1}번 컵`,
  };
  const answered = phase === "win" || phase === "lose";

  return <div className="panel concept-card demo-panel shell-game">
    <div className="shell-heading"><h2>야바위</h2>
    <p className="muted">레벨 {level} · 교환 {swaps}회</p></div>
    <div className="cup-grid">
      {order.map((cup, position) => {
        const hasBall = cup === ballCup && (phase === "reveal" || answered);
        const lifted = hasBall || (answered && pickedCup === cup);
        const lane = phase === "shuffle" && pair?.includes(position) ? (position === pair[0] ? "front" : "back") : undefined;
        return <button type="button" className="cup-button" key={cup} data-lane={lane} aria-label={`${position + 1}번 컵`}
          style={{ transform: `translateX(${position * 100}%)`, transitionDuration: `${speed}ms` }}
          disabled={phase !== "choose"} onClick={() => choose(cup)}>
          <span className="cup-visual" key={lane ? completedSwaps : "still"} style={{ animationDuration: `${speed}ms` }} aria-hidden="true">
            {hasBall && <span className="cup-ball" />}
            <span className="cup-shape" data-lifted={lifted} />
          </span>
        </button>;
      })}
    </div>
    <p role="status">{messages[phase]}</p>
    <div className="demo-actions">
      <button className="button primary" disabled={!ready || (phase !== "idle" && phase !== "lose")} onClick={start}>{phase === "lose" ? "다시하기" : "시작"}</button>
      <button className="button" disabled={!ready || !score.played} onClick={() => { setScore(emptyScore); setPhase("idle"); setLevel(1); setPickedCup(null); }}>기록 초기화</button>
    </div>
    <section aria-label="게임 기록">
      <h2>게임 기록</h2><p className="muted">총 {score.played}회 · 정답 {score.wins}회</p>
      <ol className="detail-list">{score.history.map((entry, index) =>
        <li key={score.played - index}>{score.played - index}회 · {entry.choice + 1}번 선택 · {entry.correct ? "정답" : `오답 (공: ${entry.ball + 1}번)`}</li>)}</ol>
    </section>
  </div>;
}
