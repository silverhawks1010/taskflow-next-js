import type { Metadata } from "next";
import Link from "next/link";
import ProjectForm from "@/components/ProjectForm";

export const metadata: Metadata = {
  title: "Créer un projet",
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="page-content">
      <Link className="back-link" href="/projects">← Tous les projets</Link>
      <section className="page-heading">
        <div>
          <p className="eyebrow">Nouveau projet</p>
          <h1>Créer un projet</h1>
          <p className="muted">Donnez un nom à votre projet et décrivez son objectif.</p>
        </div>
      </section>
      <ProjectForm error={error} />
    </div>
  );
}
