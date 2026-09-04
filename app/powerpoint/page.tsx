import type { Metadata } from "next";
import { PowerPointLab } from "@/features/ppt/PowerPointLab";

export const metadata: Metadata = {
  title: "Laboratório PowerPoint",
  description:
    "Edite slides em tempo real: mude tema, fonte, cor, layout, formas, transições e animações.",
};

export default function Page() {
  return <PowerPointLab />;
}
