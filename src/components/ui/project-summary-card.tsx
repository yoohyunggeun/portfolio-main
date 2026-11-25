import Link from "next/link";
import { LockIcon } from "@/components/access/lock-icon";

type Props = { locked: true } | { locked?: false; href: string; label: string | undefined; title: string; summary: string };

export function ProjectSummaryCard(props: Props) {
  if (props.locked) return <div className="panel locked-project" aria-hidden="true"><span /><span /><span /><i><LockIcon /></i></div>;
  return <Link className="panel project-card" href={props.href} prefetch={false}><span>
    <small className="eyebrow lab-label">{props.label}</small><strong>{props.title}</strong><span className="muted">{props.summary}</span>
  </span></Link>;
}
