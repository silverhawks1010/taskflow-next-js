"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createId, updateDatabase } from "@/lib/data";
import { nextStatus, type Priority, type Status } from "@/lib/types";

function getText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function createProject(formData: FormData): Promise<void> {
  const name = getText(formData, "name");
  const description = getText(formData, "description");

  if (name.length < 3 || name.length > 60 || description.length > 200) {
    redirect("/projects/new?error=invalid-project");
  }

  const project = await updateDatabase((database) => {
    const newProject = { id: createId(), name, description };
    database.projects.push(newProject);
    return newProject;
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(formData: FormData): Promise<void> {
  const id = getText(formData, "id");
  const name = getText(formData, "name");
  const description = getText(formData, "description");

  if (!id) {
    throw new Error("Identifiant de projet manquant.");
  }

  if (name.length < 3 || name.length > 60 || description.length > 200) {
    redirect(`/projects/${encodeURIComponent(id)}?error=invalid-project`);
  }

  await updateDatabase((database) => {
    const project = database.projects.find((item) => String(item.id) === id);
    if (!project) {
      throw new Error(`Le projet ${id} n'existe pas.`);
    }
    project.name = name;
    project.description = description;
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(formData: FormData): Promise<void> {
  const id = getText(formData, "id");
  if (!id) {
    throw new Error("Identifiant de projet manquant.");
  }

  await updateDatabase((database) => {
    const projectExists = database.projects.some((project) => String(project.id) === id);
    if (!projectExists) {
      throw new Error(`Le projet ${id} n'existe pas.`);
    }
    database.projects = database.projects.filter((project) => String(project.id) !== id);
    database.tasks = database.tasks.filter((task) => String(task.projectId) !== id);
  });

  revalidatePath("/projects");
  redirect("/projects");
}

export async function createTask(formData: FormData): Promise<void> {
  const projectId = getText(formData, "projectId");
  const title = getText(formData, "title");
  const dueDate = getText(formData, "dueDate");
  const priorityValue = Number(getText(formData, "priority"));

  if (!projectId) {
    throw new Error("Identifiant de projet manquant.");
  }

  if (
    !title ||
    title.length > 80 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dueDate) ||
    (priorityValue !== 1 && priorityValue !== 2 && priorityValue !== 3)
  ) {
    redirect(`/projects/${encodeURIComponent(projectId)}?error=invalid-task`);
  }

  await updateDatabase((database) => {
    if (!database.projects.some((project) => String(project.id) === projectId)) {
      throw new Error(`Le projet ${projectId} n'existe pas.`);
    }
    const task = {
      id: createId(),
      projectId,
      title,
      dueDate,
      priority: priorityValue as Priority,
      status: "todo" as const,
    };
    database.tasks.push(task);
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/stats");
}

export async function cycleTaskStatus(formData: FormData): Promise<void> {
  const projectId = getText(formData, "projectId");
  const taskId = getText(formData, "taskId");
  if (!projectId || !taskId) {
    throw new Error("Identifiant de projet ou de tâche manquant.");
  }

  await updateDatabase((database) => {
    const task = database.tasks.find(
      (item) => String(item.id) === taskId && String(item.projectId) === projectId,
    );
    if (!task) {
      throw new Error(`La tâche ${taskId} n'existe pas dans le projet ${projectId}.`);
    }
    task.status = nextStatus(task.status) as Status;
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/stats");
}

export async function deleteTask(formData: FormData): Promise<void> {
  const projectId = getText(formData, "projectId");
  const taskId = getText(formData, "taskId");
  if (!projectId || !taskId) {
    throw new Error("Identifiant de projet ou de tâche manquant.");
  }

  await updateDatabase((database) => {
    const taskExists = database.tasks.some(
      (task) => String(task.id) === taskId && String(task.projectId) === projectId,
    );
    if (!taskExists) {
      throw new Error(`La tâche ${taskId} n'existe pas dans le projet ${projectId}.`);
    }
    database.tasks = database.tasks.filter(
      (task) => !(String(task.id) === taskId && String(task.projectId) === projectId),
    );
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/stats");
}
