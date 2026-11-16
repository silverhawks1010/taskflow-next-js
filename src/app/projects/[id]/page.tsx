import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectEditor from "@/components/ProjectEditor";
import TaskManager from "@/components/TaskManager";
import { getProjectWithTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectWithTasks(id);
  return {
    title: project?.name ?? "Projet introuvable",
    description: project?.description,
  };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const project = await getProjectWithTasks(id);

  if (!project) notFound();

  return (
    <div className="page-content">
      <Link className="back-link" href="/projects">← Tous les projets</Link>
      <section className="page-heading project-heading">
        <div>
          <p className="eyebrow">Projet</p>
          <h1>{project.name}</h1>
          <p className="muted">{project.description}</p>
        </div>
        <ProjectEditor project={project} error={error} />
      </section>
      <TaskManager projectId={String(project.id)} tasks={project.tasks} error={error} />
    </div>
  );
}
