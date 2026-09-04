import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/layout/AppChrome";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AchievementListener } from "@/components/game/AchievementListener";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Office Playground — Aprenda Word, Excel e PowerPoint brincando",
    template: "%s · Office Playground",
  },
  description:
    "Laboratórios interativos, jogos educativos e animações para aprender Microsoft Word, Excel e PowerPoint do zero. Explore, clique, descubra.",
  keywords: [
    "Microsoft Word",
    "Microsoft Excel",
    "Microsoft PowerPoint",
    "aprender office",
    "tutorial interativo",
    "jogos office",
    "atalhos",
    "Office Playground",
  ],
  authors: [{ name: "Office Playground" }],
  openGraph: {
    title: "Office Playground — Aprenda brincando",
    description:
      "Um playground digital para descobrir Word, Excel e PowerPoint com experiências interativas.",
    type: "website",
    locale: "pt-BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Office Playground",
    description:
      "Laboratórios interativos para aprender Word, Excel e PowerPoint.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b13" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Pular para o conteúdo
          </a>
          <AppChrome>{children}</AppChrome>
          <AchievementListener />
        </ThemeProvider>
      </body>
    </html>
  );
}
