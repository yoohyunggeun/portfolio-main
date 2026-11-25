"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export const capabilitySlides = [
  { id: "java", title: "JAVA", label: "01 / DEVELOPMENT", description: "Java 기반 업무 화면과 API를 구현합니다.", detail: "화면 · 업무 로직" },
  { id: "report", title: "REPORT", label: "02 / REPORTING", description: "업무 데이터를 보고서로 연결합니다.", detail: "AIReport · 양식 개발" },
  { id: "operate", title: "OPERATE", label: "03 / OPERATIONS", description: "설치부터 유지보수와 기술 지원까지.", detail: "제품 적용 · 운영 지원" },
  { id: "cloud", title: "CLOUD", label: "04 / ENVIRONMENT", description: "온프레미스·클라우드 환경을 구성합니다.", detail: "서버 · 실행 환경" },
  { id: "api", title: "API", label: "05 / INTEGRATION", description: "서비스 사이의 흐름을 연결합니다.", detail: "Java · 시스템 연동" },
  { id: "data", title: "DATA", label: "06 / MAPPING", description: "업무 데이터를 정확하게 매핑합니다.", detail: "JSON · 데이터 매핑" },
] as const;

type Props = { autoPlay?: boolean; initialIndex?: number };
export function HeroSlider({ autoPlay = true, initialIndex = 0 }: Props) {
  const [selected, setSelected] = useState(((initialIndex % capabilitySlides.length) + capabilitySlides.length) % capabilitySlides.length);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const reduced = useReducedMotion();
  useEffect(() => setMounted(true), []);
  const move = (delta: number) => setSelected(index => (index + delta + capabilitySlides.length) % capabilitySlides.length);
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .2 });
    observer.observe(node);
    const visibility = () => setPageVisible(document.visibilityState === "visible");
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    if (!autoPlay || paused || engaged || reduced !== false || !pageVisible || !inView) return;
    const timer = window.setTimeout(() => move(1), 6500);
    return () => window.clearTimeout(timer);
  }, [autoPlay, paused, engaged, reduced, pageVisible, inView, selected]);

  return <section className="hero-slider" aria-roledescription="슬라이드" aria-label="역량 한눈에 보기"
    onPointerEnter={() => setEngaged(true)} onPointerLeave={event => setEngaged(event.currentTarget.contains(document.activeElement))}
    onFocusCapture={() => setEngaged(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }}>
    <div className="hero-slider-viewport" ref={viewport}
      onPointerDown={event => { touchStart.current = { x: event.clientX, y: event.clientY }; suppressClick.current = false; }}
      onPointerCancel={() => { touchStart.current = null; }}
      onPointerUp={event => {
        const start = touchStart.current; touchStart.current = null;
        if (!start) return;
        const dx = event.clientX - start.x, dy = event.clientY - start.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) { suppressClick.current = true; move(dx < 0 ? 1 : -1); }
      }}>
      {capabilitySlides.map((slide, index) => {
        const offset = ((index - selected + capabilitySlides.length + 3) % capabilitySlides.length) - 3;
        const visible = Math.abs(offset) <= 1;
        return <motion.button type="button" key={slide.id} className="capability-slide" data-slide={slide.id}
          aria-pressed={offset === 0} aria-label={`${slide.title}${offset === 0 ? ", 현재 카드" : ", 가운데로 이동"}`}
          aria-hidden={!visible} tabIndex={visible ? 0 : -1}
          initial={false} animate={{ x: `calc(${offset * 100}% + ${offset * 16}px)`, opacity: visible ? offset === 0 ? 1 : .65 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: .75, ease: [.22, .8, .2, 1] }}
          style={{ pointerEvents: visible ? "auto" : "none", zIndex: offset === 0 ? 2 : 1 }}
          onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } setSelected(index); }}>
          <small>{slide.label}</small><strong>{slide.title}</strong><p>{slide.description}</p><span>{slide.detail}</span>
        </motion.button>;
      })}
    </div>
    <div className="hero-slider-controls">
      <button type="button" className="slider-arrow" aria-label="이전 역량 카드" onClick={() => move(-1)}>←</button>
      <span className="slider-count" aria-live={paused || engaged ? "polite" : "off"} aria-atomic="true">{String(selected + 1).padStart(2, "0")} / 06</span>
      <button type="button" className="slider-arrow" aria-label="다음 역량 카드" onClick={() => move(1)}>→</button>
      {autoPlay && mounted && !reduced && <button type="button" className="slider-pause" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "자동재생" : "일시정지"}</button>}
    </div>
    <p className="sr-only">{capabilitySlides[selected].description}</p>
  </section>;
}
