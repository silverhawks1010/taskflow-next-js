"use client";

import { useMemo, useState } from "react";
import { createTask, cycleTaskStatus, deleteTask } from "@/app/actions";
import { STATUS_LABEL, type Status, type Task } from "@/lib/types";

type TaskManagerProps = {
  projectId: string;
  tasks: Task[];
  error?: string;
};

const FILTERS: { value: Status | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "todo", label: "À faire" },
  { value: "in-doing", label: "En cours" },
  { value: "done", label: "Terminées" },
];

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR");
}

export default function TaskManager({ projectId, tasks, error }: TaskManagerProps) {
  const [filter, setFilter] = useState<Status | "all">("all");
  const [sortDescending, setSortDescending] = useState(false);

  const visibleTasks = useMemo(() => {
    const filtered = filter === "all" ? tasks : tasks.filter((task) => task.status === filter);
    return [...filtered].sort((first, second) => {
      if (!first.dueDate) return second.dueDate ? 1 : 0;
      if (!second.dueDate) return -1;
      return sortDescending
        ? second.dueDate.localeCompare(first.dueDate)
        : first.dueDate.localeCompare(second.dueDate);
    });
  }, [filter, sortDescending, tasks]);

  return (
    <article className="card">
      <header className="card__header">
        <h2>Tâches</h2>
        <div className="task-toolbar">
          <div className="filters" role="group" aria-label="Filtrer les tâches">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSortDescending((descending) => !descending)}
            aria-label={`Trier les échéances par ordre ${sortDescending ? "croissant" : "décroissant"}`}
          >
            Échéance {sortDescending ? "↓" : "↑"}
          </button>
        </div>
      </header>

      {error === "invalid-task" && (
        <p className="error" role="alert">Vérifiez le titre, l’échéance et la priorité de la tâche.</p>
      )}

      <form className="task-form" action={createTask}>
        <input type="hidden" name="projectId" value={projectId} />
        <label className="sr-only" htmlFor="new-task">Nouvelle tâche</label>
        <input
          id="new-task"
          name="title"
          placeholder="Nouvelle tâche"
          maxLength={80}
          required
        />
        <label htmlFor="new-task-due-date">Échéance</label>
        <input id="new-task-due-date" name="dueDate" type="date" required />
        <select name="priority" aria-label="Priorité" defaultValue="2">
          <option value="1">Haute</option>
          <option value="2">Moyenne</option>
          <option value="3">Faible</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>

      {visibleTasks.length === 0 ? (
        <p className="empty">Aucune tâche pour ce filtre.</p>
      ) : (
        <ul className="tasks">
          {visibleTasks.map((task) => (
            <li className={`task task--${task.status}`} key={task.id}>
              <form action={cycleTaskStatus}>
                <input type="hidden" name="projectId" value={projectId} />
                <input type="hidden" name="taskId" value={task.id} />
                <button
                  type="submit"
                  className="task__status"
                  title="Passer au statut suivant"
                  aria-label={`Statut : ${STATUS_LABEL[task.status]}. Passer au suivant`}
                >
                  {STATUS_LABEL[task.status]}
                </button>
              </form>
              <span className="task__title">{task.title}</span>
              {task.dueDate ? (
                <time className="task__due-date" dateTime={task.dueDate}>
                  {formatDate(task.dueDate)}
                </time>
              ) : (
                <span className="task__due-date">Sans échéance</span>
              )}
              <span className={`prio prio--${task.priority}`}>P{task.priority}</span>
              <form action={deleteTask}>
                <input type="hidden" name="projectId" value={projectId} />
                <input type="hidden" name="taskId" value={task.id} />
                <button
                  type="submit"
                  className="task__remove"
                  title="Supprimer la tâche"
                  aria-label={`Supprimer la tâche ${task.title}`}
                >
                  ×
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
