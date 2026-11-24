import Link from "next/link";
import {
  workRoleLabel,
  type WorkRecord,
} from "@/content/projects/work-records";

export function WorkRecordGrid({
  records,
  featured = false,
}: {
  records: readonly WorkRecord[];
  featured?: boolean;
}) {
  return (
    <ul className="concept-grid two record-grid">
      {records.map((record) => (
        <li key={record.id}>
          <Link
            className="panel concept-card record-card"
            href={`/work/${record.slug}`}
            prefetch={false}
          >
            <p className="eyebrow lab-label">
              {[
                record.organization,
                ...(featured ? record.roles.slice(0, 1) : record.roles).map(
                  workRoleLabel,
                ),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <h2>{record.title}</h2>
            <p className="muted">{record.task}</p>
            {featured && <span className="text-link">담당 업무 보기 →</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
