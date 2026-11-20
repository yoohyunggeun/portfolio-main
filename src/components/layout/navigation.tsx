"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Home"], ["/experience", "Experience"], ["/work", "실무 프로젝트"],
  ["/lab", "개인 프로젝트"], ["/skills", "Skills"], ["/learning", "Learning"], ["/build-log", "제작 과정"],
];

function NavigationLinks() {
  const pathname = usePathname();
  return links.map(([href, label]) => {
    const active = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
    return <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={active ? "active" : undefined}>{label}</Link>;
  });
}

export function Navigation() {
  return <>
    <nav aria-label="주 메뉴" className="desktop-nav"><NavigationLinks /></nav>
    <details className="mobile-nav" key={usePathname()}>
      <summary><span className="sr-only">메뉴</span></summary>
      <nav aria-label="주 메뉴"><NavigationLinks /></nav>
    </details>
  </>;
}
