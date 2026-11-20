"use client";

import { useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

const works = [
  { title: "도시의 야경", color: "violet", detail: "보라색과 네이비의 대비로 깊이를 표현한 컬러 스터디입니다." },
  { title: "새벽의 파도", color: "mint", detail: "민트와 블루가 이어지는 색상 전환을 살펴보는 컬러 스터디입니다." },
];

export function GalleryMotion() {
  const [selected, setSelected] = useState(null);
  const reducedMotion = useReducedMotion();
  const sharedId = (color) => reducedMotion ? undefined : `swatch-${color}`;
  const work = selected === null ? null : works[selected];

  return <LayoutGroup>
    <div className="panel concept-card demo-panel frontend-example">
      <h2>컬러 갤러리</h2>
      <div className="gallery-options">
        {works.map(({ title, color }, index) => <button type="button" key={color} className="button"
          aria-expanded={selected === index} aria-controls="gallery-detail"
          onClick={() => setSelected((current) => current === index ? null : index)}>
          <span className="gallery-swatch-slot" aria-hidden="true">
            {selected === index
              ? <span className={`gallery-swatch ${color} gallery-swatch-origin`} />
              : <motion.span layoutId={sharedId(color)} className={`gallery-swatch ${color}`} />}
          </span>
          {title}
        </button>)}
      </div>
      <div id="gallery-detail" className="example-surface gallery-detail" aria-live="polite">
        {work ? <>
          <motion.div layoutId={sharedId(work.color)} className={`gallery-swatch gallery-swatch-large ${work.color}`} aria-hidden="true" />
          <h3>{work.title}</h3>
          <p>{work.detail}</p>
        </> : <p className="muted">카드를 선택해 컬러 스터디를 펼쳐 보세요.</p>}
      </div>
    </div>
  </LayoutGroup>;
}
