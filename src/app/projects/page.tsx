import type { Metadata } from "next";
import Link from "next/link";
import FocusTimer from "@/components/FocusTimer";
import { getProjectsWithTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes projets",
};

export default async function ProjectsPage() {
  const projects = await getProjectsWithTasks();

  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Votre espace de travail</p>
          <h1>Mes projets</h1>
          <p className="muted">Retrouvez vos projets et l’avancement de leurs tâches.</p>
        </div>
        <Link className="primary-link" href="/projects/new">
          Créer un projet
        </Link>
      </section>

      <article className="card">
        <header className="card__header">
          <h2>Concentration</h2>
        </header>
        <FocusTimer />
      </article>

      <section aria-labelledby="projects-heading">
        <h2 className="section-title" id="projects-heading">Projets</h2>
        {projects.length === 0 ? (
          <div className="empty-projects">
            <p>Aucun projet pour le moment.</p>
            <Link href="/projects/new">Créer votre premier projet</Link>
          </div>
        ) : (
          <ul className="project-grid">
            {projects.map((project) => {
              const completedCount = project.tasks.filter((task) => task.status === "done").length;
              return (
                <li key={project.id}>
                  <Link className="project-card" href={`/projects/${project.id}`}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <span className="project-progress">
                      {completedCount} / {project.tasks.length} tâche(s) terminée(s)
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
