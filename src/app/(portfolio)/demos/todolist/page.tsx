import { canReadProjects } from "@/server/access/session";
import { ProjectLock } from "@/components/access/project-lock";
import Link from "next/link";
import { TodoList } from "@/features/demos/frontend/todolist/TodoList";

export async function generateMetadata() {
  return {
    title: (await canReadProjects()) ? "TodoList 실행" : "프로젝트 열람 안내",
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage() {
  if (!(await canReadProjects())) return <ProjectLock />;
  return (
    <section className="page-section">
      <p className="eyebrow">JAVASCRIPT / INTERACTIVE</p>
      <h1>TodoList</h1>
      <p className="lede">이 브라우저에만 기록이 저장됩니다.</p>
      <TodoList />
      <Link
        prefetch={false}
        href="/lab/projects/todolist"
        className="text-link"
      >
        ← 프로젝트 상세
      </Link>
    </section>
  );
}

export const dynamic = "force-dynamic";
