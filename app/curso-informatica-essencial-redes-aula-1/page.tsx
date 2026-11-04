import type { Metadata } from "next";
import { InfoEssencialRedesAula1 } from "@/features/curso/InfoEssencialRedesAula1";

export const metadata: Metadata = {
  title: "Curso - Informática Essencial - Redes, Aula 1",
  description:
    "Animações e atividades da Aula 1 de Redes do curso Informática Essencial: tipos de rede, topologias, camadas, IP, máscara, gateway, DNS, velocidade e terminal.",
};

export default function Page() {
  return <InfoEssencialRedesAula1 />;
}
