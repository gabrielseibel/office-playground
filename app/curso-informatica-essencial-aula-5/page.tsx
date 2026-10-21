import type { Metadata } from "next";
import { InfoEssencialAula5 } from "@/features/curso/InfoEssencialAula5";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - Aula 5",
  description:
    "Atividades da Aula 5 do curso Informática Essencial: tipos de licença, pode ou não pode, instalador armadilha, desinstalação, compatibilidade, chamados e verdade ou mito.",
};

export default function Page() {
  return <InfoEssencialAula5 />;
}
