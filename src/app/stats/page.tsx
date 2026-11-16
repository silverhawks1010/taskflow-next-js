import type { Metadata } from "next";
import { STATUS_LABEL, type Status } from "@/lib/types";
import { getProjectsWithTasks } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Statistiques",
};

const STATUSES: Status[] = ["todo", "in-doing", "done"];

export default async function StatsPage() {
  const projects = await getProjectsWithTasks();
  const tasks = projects.flatMap((project) => project.tasks);

  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Vue d’ensemble</p>
          <h1>Statistiques</h1>
          <p className="muted">Répartition des tâches par statut et par projet.</p>
        </div>
      </section>

      <article className="card">
        <header className="card__header">
          <h2>Tâches par statut</h2>
        </header>
        <ul className="stats-grid">
          {STATUSES.map((status) => (
            <li className={`stat-card stat-card--${status}`} key={status}>
              <span>{STATUS_LABEL[status]}</span>
              <strong>{tasks.filter((task) => task.status === status).length}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="card">
        <header className="card__header">
          <h2>Tâches par projet</h2>
        </header>
        {projects.length === 0 ? (
          <p className="empty-projects">Aucun projet à afficher.</p>
        ) : (
          <ul className="project-stats">
            {projects.map((project) => (
              <li key={project.id}>
                <strong>{project.name}</strong>
                <span>{project.tasks.length} tâche(s)</span>
                <span>
                  {project.tasks.filter((task) => task.status === "done").length} terminée(s)
                </span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  );
}
