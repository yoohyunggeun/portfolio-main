"use client";

import Link from "next/link";
import { FocusHeading } from "./focus-heading";

export function AccessRouteError({ title, href, linkLabel }: {
  title: string; href: string; linkLabel: string;
}) {
  return <section className="page-section access-shell">
    <div className="panel concept-card access-card">
      <FocusHeading>{title}</FocusHeading>
      <p className="muted">잠시 후 다시 시도해 주세요.</p>
      <button className="button primary" onClick={() => window.location.reload()}>다시 시도</button>
      <Link className="text-link" href={href}>{linkLabel} →</Link>
    </div>
  </section>;
}
