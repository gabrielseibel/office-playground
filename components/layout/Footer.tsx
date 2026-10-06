import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/10 bg-gradient-to-br from-blue-50/60 via-white/40 to-emerald-50/60 py-12 backdrop-blur-xl dark:from-blue-950/30 dark:via-black/40 dark:to-emerald-950/30">
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-600 via-emerald-500 to-orange-500 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold">Office Playground</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Um playground digital gratuito e aberto para todos que querem
              descobrir o Microsoft Word, Excel e PowerPoint brincando.
              Construído com carinho para crianças, adolescentes, adultos e
              idosos.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Explorar</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/word">
                  Laboratório Word
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/excel">
                  Laboratório Excel
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/powerpoint">
                  Laboratório PowerPoint
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/jogos">
                  🎮 Arcade
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/conquistas">
                  🏆 Conquistas
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/sala-de-aula">
                  🎓 Sala de Aula
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/desafio-mestre">
                  👑 Desafio Mestre
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-foreground"
                  href="/curso-informatica-essencial-aula-4"
                >
                  🖥️ Curso: Informática Essencial — Aula 4
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Descobrir</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/#dicas">
                  Atalhos e dicas
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/#curiosidades">
                  Curiosidades
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/#comparacoes">
                  Antes e depois
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/#sobre">
                  Sobre o projeto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            Feito com <Heart className="inline h-4 w-4 text-rose-500" /> para
            quem quer aprender sem medo.
          </p>
          <p>© {new Date().getFullYear()} Office Playground</p>
        </div>
      </div>
    </footer>
  );
}
