import type { Metadata } from "next";
import { ExcelLab } from "@/features/excel/ExcelLab";

export const metadata: Metadata = {
  title: "Laboratório Excel",
  description:
    "Digite números, calcule com SOMA, MÉDIA, MÁXIMO, MÍNIMO e CONT.SE e veja gráficos animados no Microsoft Excel.",
};

export default function Page() {
  return <ExcelLab />;
}
