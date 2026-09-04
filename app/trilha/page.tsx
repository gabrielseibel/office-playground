import type { Metadata } from "next";
import { Suspense } from "react";
import { TrilhaPage } from "@/features/trilha/TrilhaPage";

export const metadata: Metadata = {
  title: "Trilha de Aprendizagem",
  description:
    "Um caminho passo a passo para aprender Word, Excel e PowerPoint do zero, com mini aulas e desafios em cada etapa.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TrilhaPage />
    </Suspense>
  );
}
