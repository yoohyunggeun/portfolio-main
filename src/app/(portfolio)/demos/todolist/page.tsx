import Link from "next/link";
import { TodoList } from "@/features/demos/todolist/TodoList";

export const metadata = { title: "TodoList 데모" };

export default function DemoPage() {
  return <section className="page-section">
    <p className="eyebrow">JAVASCRIPT DEMO</p>
    <h1>TodoList</h1>
    <p className="lede">이 브라우저에만 기록이 저장됩니다.</p>
    <TodoList />
    <Link href="/lab/projects/todolist" className="text-link">← 프로젝트 상세</Link>
  </section>;
}
