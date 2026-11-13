import type { Metadata } from "next";
import { GuiaCurso } from "@/features/curso/GuiaCurso";

export const metadata: Metadata = {
  title: "Informática Essencial UC3",
  description: "Guia das aulas da UC3 do curso Informática Essencial, com animações e atividades interativas.",
};

export default function Page() {
  return <GuiaCurso uc="uc3" />;
}
