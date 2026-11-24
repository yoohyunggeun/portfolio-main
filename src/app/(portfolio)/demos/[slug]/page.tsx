import { canReadProjects } from "@/server/access/session";
import { ProjectLock } from "@/components/access/project-lock";
import Link from "next/link";
import { notFound } from "next/navigation";
import { frontendExamples } from "@/content/projects/personal/frontend-examples";
import { GalleryMotion } from "@/features/demos/frontend/gallery-motion/GalleryMotion";
import { AsyncSearch } from "@/features/demos/frontend/async-search/AsyncSearch";
import { UndoCart } from "@/features/demos/frontend/undo-cart/UndoCart";

import { ScrollShowcase } from "@/features/demos/frontend/scroll-showcase/ScrollShowcase";

import { ZustandCart } from "@/features/demos/frontend/zustand-cart/ZustandCart";

import { ActionForm } from "@/features/demos/frontend/server-action-form/ActionForm";

import { OptimisticLike } from "@/features/demos/frontend/optimistic-like/OptimisticLike";

import { TransitionSearch } from "@/features/demos/frontend/transition-search/TransitionSearch";

import { SuspenseReport } from "@/features/demos/frontend/suspense-report/SuspenseReport";

import { BoundaryDemo } from "@/features/demos/frontend/nextjs-boundaries/BoundaryDemo";

const demos = {
  "nextjs-boundaries": BoundaryDemo,
  "suspense-report": SuspenseReport,
  "transition-search": TransitionSearch,
  "optimistic-like": OptimisticLike,
  "server-action-form": ActionForm,
  "zustand-cart": ZustandCart,
  "scroll-showcase": ScrollShowcase,
  "gallery-motion": GalleryMotion,
  "async-search": AsyncSearch,
  "undo-cart": UndoCart,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return frontendExamples.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: (await canReadProjects())
      ? frontendExamples.find((example) => example.slug === slug)?.title
      : "프로젝트 열람 안내",
    robots: { index: false, follow: false },
  };
}

export default async function FrontendDemo({ params }: Props) {
  if (!(await canReadProjects())) return <ProjectLock />;
  const { slug } = await params;
  const example = frontendExamples.find((item) => item.slug === slug);
  if (!example) notFound();
  const Demo = demos[example.slug];

  return (
    <section className="page-section">
      <h1>{example.title}</h1>
      <p className="lede">{example.summary}</p>
      <Demo />
      <Link
        prefetch={false}
        href={`/lab/projects/${example.slug}`}
        className="text-link"
      >
        ← 프로젝트 상세
      </Link>
    </section>
  );
}

export const dynamic = "force-dynamic";
