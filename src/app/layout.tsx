import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";
import "./taskflow.css";

export const metadata: Metadata = {
  title: {
    default: "TaskFlow",
    template: "%s | TaskFlow",
  },
  description: "Organisez vos projets et suivez l'avancement de vos tâches.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <main className="App">
          <SiteHeader />
          {children}
        </main>
      </body>
    </html>
  );
}
