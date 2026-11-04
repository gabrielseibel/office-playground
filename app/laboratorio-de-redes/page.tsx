import type { Metadata } from "next";
import { LaboratorioRedes } from "@/features/curso/LaboratorioRedes";

export const metadata: Metadata = {
  title: "Laboratório de Redes",
  description:
    "Simulador de redes locais: monte a topologia com switch ou hub, configure IP, máscara, gateway e DNS, e use o terminal do técnico com ipconfig, ping, tracert, nslookup e arp.",
};

export default function Page() {
  return <LaboratorioRedes />;
}
