import Link from "next/link";
import { createProject } from "@/app/actions";

type ProjectFormProps = {
  error?: string;
};

export default function ProjectForm({ error }: ProjectFormProps) {
  return (
    <form className="project-form" action={createProject}>
      {error === "invalid-project" && (
        <p className="error" role="alert">Le nom doit contenir de 3 à 60 caractères et la description 200 caractères maximum.</p>
      )}
      <div className="field">
        <label htmlFor="project-name">Nom du projet</label>
        <input
          id="project-name"
          name="name"
          minLength={3}
          maxLength={60}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="project-description">Description</label>
        <textarea
          id="project-description"
          name="description"
          maxLength={200}
          rows={4}
        />
      </div>
      <div className="form-actions">
        <Link className="secondary-link" href="/projects">Annuler</Link>
        <button className="primary-button" type="submit">Créer le projet</button>
      </div>
    </form>
  );
}
