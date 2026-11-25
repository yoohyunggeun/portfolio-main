"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/** Decorative, bounded canvas; no user data, network requests, or global pointer tracking. */
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current, parent = canvas?.parentElement, ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;
    let width = 1, height = 1, frame = 0, previous = 0, inView = false, white = document.documentElement.dataset.theme === "white";
    let points: { x: number; y: number; dx: number; dy: number; radius: number }[] = [];
    let pointer: { x: number; y: number } | null = null;
    function draw(dt = 0) {
      ctx!.clearRect(0, 0, width, height);
      for (const [i, p] of points.entries()) {
        if (dt) { p.x = (p.x + p.dx * dt + width) % width; p.y = (p.y + p.dy * dt + height) % height; }
        const near = pointer && Math.hypot(pointer.x - p.x, pointer.y - p.y) < 105;
        ctx!.fillStyle = white ? "#4969a8" : "#87b9a8";
        ctx!.globalAlpha = near ? .8 : white ? .64 : .42;
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx!.fill();
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j], distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance > 120) continue;
          ctx!.globalAlpha = (1 - distance / 120) * (white ? .36 : .2);
          ctx!.strokeStyle = white ? "#5674ae" : "#6ee7c4"; ctx!.lineWidth = .8;
          ctx!.beginPath(); ctx!.moveTo(p.x, p.y); ctx!.lineTo(q.x, q.y); ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;
    }
    function resize() {
      width = parent!.clientWidth; height = parent!.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr; canvas!.height = height * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = Array.from({ length: width < 600 ? 26 : 48 }, (_, i) => ({ x: ((i * 137.31 + 29) % 997) / 997 * width, y: ((i * 79.73 + 61) % 991) / 991 * height, dx: Math.sin(i * 2.4) * .006, dy: Math.cos(i * 1.7) * .005, radius: i % 4 === 0 ? 1.8 : 1.2 }));
      draw();
    }
    function tick(now: number) {
      frame = 0;
      if (!inView || document.hidden || reduced !== false) return;
      if (now - previous >= 32) { const dt = Math.min(now - previous, 64); previous = now; draw(dt); }
      frame = requestAnimationFrame(tick);
    }
    function sync() { cancelAnimationFrame(frame); frame = 0; previous = performance.now(); draw(); if (inView && !document.hidden && reduced === false) frame = requestAnimationFrame(tick); }
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    const theme = () => { white = document.documentElement.dataset.theme === "white"; draw(); };
    const move = (event: PointerEvent) => { const box = parent!.getBoundingClientRect(); pointer = { x: event.clientX - box.left, y: event.clientY - box.top }; if (reduced) draw(); };
    const leave = () => { pointer = null; if (reduced) draw(); };
    resizeObserver.observe(parent); visibilityObserver.observe(parent); resize();
    window.addEventListener("portfolio-theme-change", theme); document.addEventListener("visibilitychange", sync);
    parent.addEventListener("pointermove", move); parent.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); window.removeEventListener("portfolio-theme-change", theme); document.removeEventListener("visibilitychange", sync); parent.removeEventListener("pointermove", move); parent.removeEventListener("pointerleave", leave); };
  }, [reduced]);
  return <canvas ref={ref} className="hero-particles" aria-hidden="true" />;
}
