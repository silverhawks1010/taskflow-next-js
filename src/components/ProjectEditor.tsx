"use client";

import { useState } from "react";
import { deleteProject, updateProject } from "@/app/actions";
import type { Project } from "@/lib/types";

type ProjectEditorProps = {
  project: Project;
  error?: string;
};

export default function ProjectEditor({ project, error }: ProjectEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="project-actions">
        <button type="button" onClick={() => setIsEditing((editing) => !editing)}>
          {isEditing ? "Annuler" : "Modifier le projet"}
        </button>
        <form
          action={deleteProject}
          onSubmit={(event) => {
            if (!window.confirm(`Supprimer le projet « ${project.name} » et toutes ses tâches ?`)) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={project.id} />
          <button type="submit" className="danger-button">Supprimer le projet</button>
        </form>
      </div>

      {error === "invalid-project" && (
        <p className="error" role="alert">Le nom doit contenir de 3 à 60 caractères et la description 200 caractères maximum.</p>
      )}

      {isEditing && (
        <form className="project-form" action={updateProject}>
          <input type="hidden" name="id" value={project.id} />
          <div className="field">
            <label htmlFor="edit-project-name">Nom du projet</label>
            <input
              id="edit-project-name"
              name="name"
              defaultValue={project.name}
              minLength={3}
              maxLength={60}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="edit-project-description">Description</label>
            <textarea
              id="edit-project-description"
              name="description"
              defaultValue={project.description}
              maxLength={200}
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button className="primary-button" type="submit">Enregistrer</button>
          </div>
        </form>
      )}
    </>
  );
}
