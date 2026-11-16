import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AboutPage() {
  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">TaskFlow</p>
          <h1>À propos</h1>
          <p className="muted">
            Une application de démonstration pour organiser des projets et suivre les tâches.
          </p>
        </div>
      </section>
      <article className="card">
        <header className="card__header">
          <h2>Construit avec Next.js</h2>
        </header>
        <p>
          Les pages et les données de projets sont préparées sur le serveur avec l’App Router.
          Seules les interactions qui en ont besoin utilisent des composants client.
        </p>
      </article>
    </div>
  );
}
