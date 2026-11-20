"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stages = [
  { title: "01 · 소재", description: "손에 닿는 매트한 표면", color: "violet" },
  { title: "02 · 형태", description: "책상 위 공간을 줄인 작은 실루엣", color: "mint" },
  { title: "03 · 색상", description: "어두운 공간에서 드러나는 민트 포인트", color: "blue" },
];

export function ScrollShowcase() {
  const root = useRef(null);
  const viewport = useRef(null);
  const progress = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(root.current);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: viewport.current.firstElementChild,
          scroller: viewport.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      timeline.fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
      timeline.from(".scroll-stage + .scroll-stage .scroll-product", {
        y: 36, scale: .84, duration: .32, stagger: .38, ease: "none",
      }, .15);
    });

    return () => media.revert();
  }, []);

  return <div className="panel concept-card demo-panel frontend-example" ref={root}>
    <h2>스크롤 제품 소개</h2>
    <p className="muted" id="scroll-demo-help">아래 영역을 스크롤해 제품의 소재, 형태, 색상을 살펴보세요.</p>
    <div className="scroll-progress" aria-hidden="true"><span ref={progress} /></div>
    <div className="scroll-showcase" tabIndex={0} ref={viewport} role="region" aria-label="제품 소개 스크롤 영역" aria-describedby="scroll-demo-help">
      <div>
        {stages.map(({ title, description, color }) => <section key={title} className={`scroll-stage ${color}`}>
          <div className="scroll-product" aria-hidden="true" />
          <h3>{title}</h3><p>{description}</p>
        </section>)}
      </div>
    </div>
  </div>;
}
