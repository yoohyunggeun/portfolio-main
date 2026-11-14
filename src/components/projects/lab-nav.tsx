import Link from "next/link";

export function LabNav({ area }: { area: string }) {
  return <nav className="concept-tabs lab-tabs" aria-label="개인 프로젝트 분야">
    {[["frontend", "Frontend"], ["backend", "Backend"], ["ai-llm", "AI / LLM"]].map(([slug, label]) =>
      <Link key={slug} href={`/lab/${slug}`} aria-current={slug === area ? "page" : undefined}>{label}</Link>)}
  </nav>;
}
