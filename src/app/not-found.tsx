import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">Erreur 404</p>
      <h1>Page introuvable</h1>
      <p>Cette page ou ce projet n’existe pas.</p>
      <Link className="primary-link" href="/projects">Retour aux projets</Link>
    </section>
  );
}
