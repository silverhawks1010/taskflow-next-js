import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="app-header">
      <Link className="app-brand" href="/projects">
        TaskFlow
      </Link>
      <nav className="main-nav" aria-label="Navigation principale">
        <Link href="/projects">Projets</Link>
        <Link href="/projects/new">Nouveau projet</Link>
        <Link href="/stats">Statistiques</Link>
        <Link href="/about">À propos</Link>
      </nav>
      <ThemeToggle />
    </header>
  );
}
