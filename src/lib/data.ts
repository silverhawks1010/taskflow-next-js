import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Database, Project, ProjectWithTasks, Task } from "@/lib/types";

const DATABASE_PATH = path.join(process.cwd(), "db.json");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProject(value: unknown): value is Project {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.name === "string" &&
    typeof value.description === "string"
  );
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    (typeof value.projectId === "string" || typeof value.projectId === "number") &&
    typeof value.title === "string" &&
    (value.status === "todo" || value.status === "in-doing" || value.status === "done") &&
    (value.priority === 1 || value.priority === 2 || value.priority === 3) &&
    (value.dueDate === undefined || typeof value.dueDate === "string")
  );
}

function isDatabase(value: unknown): value is Database {
  return (
    isRecord(value) &&
    Array.isArray(value.projects) &&
    value.projects.every(isProject) &&
    Array.isArray(value.tasks) &&
    value.tasks.every(isTask)
  );
}

export async function readDatabase(): Promise<Database> {
  const content = await readFile(DATABASE_PATH, "utf8");
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    throw new Error("Le fichier db.json contient un JSON invalide.", { cause: error });
  }

  if (!isDatabase(parsed)) {
    throw new Error("Le fichier db.json ne respecte pas le format attendu.");
  }

  return parsed;
}

let writeQueue: Promise<void> = Promise.resolve();

export function updateDatabase<T>(update: (database: Database) => T | Promise<T>): Promise<T> {
  const operation = writeQueue.then(async () => {
    const database = await readDatabase();
    const result = await update(database);
    await writeFile(DATABASE_PATH, `${JSON.stringify(database, null, 2)}\n`, "utf8");
    return result;
  });

  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );

  return operation;
}

export async function getProjectsWithTasks(): Promise<ProjectWithTasks[]> {
  const database = await readDatabase();
  return database.projects.map((project) => ({
    ...project,
    tasks: database.tasks.filter(
      (task) => String(task.projectId) === String(project.id),
    ),
  }));
}

export async function getProjectWithTasks(
  id: string,
): Promise<ProjectWithTasks | undefined> {
  const projects = await getProjectsWithTasks();
  return projects.find((project) => String(project.id) === id);
}

export function createId(): string {
  return randomUUID();
}
