import Link from "next/link";
import { labAreas } from "@/content/projects/lab-areas";

export function LabNav({ area }: { area: string }) {
  return (
    <nav className="concept-tabs lab-tabs" aria-label="개인 프로젝트 분야">
      {labAreas.map(({ slug, title: label }) => (
        <Link
          prefetch={false}
          key={slug}
          href={`/lab/${slug}`}
          aria-current={slug === area ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
