"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * O Modo Sala de Aula é pensado para tela cheia/projetor: ele já tem seu
 * próprio cabeçalho e controles, então escondemos o chrome padrão do site
 * para não duplicar barras de navegação na tela do professor.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isClassroom = pathname?.startsWith("/sala-de-aula");

  if (isClassroom) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
