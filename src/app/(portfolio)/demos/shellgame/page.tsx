import Link from "next/link";
import { ShellGame } from "@/features/demos/shellgame/ShellGame";

export const metadata = { title: "ShellGame 데모" };

export default function DemoPage() {
  return <section className="page-section">
    <p className="eyebrow">JAVASCRIPT DEMO</p>
    <h1>ShellGame</h1>
    <p className="lede">이 브라우저에만 기록이 저장됩니다.</p>
    <ShellGame />
    <Link href="/lab/projects/shellgame" className="text-link">← 프로젝트 상세</Link>
  </section>;
}
