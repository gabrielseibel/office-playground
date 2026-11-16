import type { Metadata } from "next";
import { InfoEssencialUC2Aula2 } from "@/features/curso/InfoEssencialUC2Aula2";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - UC2, Aula 2",
  description:
    "Simuladores de instalação do Windows 11 e de formatação e partições, mais atividades sobre pendrive bootável, telas do instalador, sistemas de arquivos e diagnóstico de boot.",
};

export default function Page() {
  return <InfoEssencialUC2Aula2 />;
}
