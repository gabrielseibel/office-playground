import type { Metadata } from "next";
import { InfoEssencialUC2Aula1 } from "@/features/curso/InfoEssencialUC2Aula1";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - UC2, Aula 1",
  description:
    "Animações e atividades da Aula 1 da UC2 do curso Informática Essencial: camadas do computador, funções do sistema operacional, requisitos do Windows 11 e cronograma de instalação.",
};

export default function Page() {
  return <InfoEssencialUC2Aula1 />;
}
