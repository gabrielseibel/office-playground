/**
 * GitHub Pages só serve arquivos estáticos, então o build de produção sai
 * como export estático (pasta `out/`), e o site vive em um subcaminho
 * (https://<usuario>.github.io/<repo>/) em vez da raiz do domínio.
 * GITHUB_ACTIONS=true é setado automaticamente pelo workflow de deploy —
 * localmente (`npm run dev` / `npm run build`) nada disso é aplicado.
 */
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = "office-playground";
const basePath = isGithubActions ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode só afeta o modo de desenvolvimento (a build de produção já
  // renderiza uma vez só) — mas em dev ele renderiza cada componente e roda
  // cada efeito em dobro de propósito, o que deixava a navegação local mais
  // pesada do que o site realmente é depois de publicado.
  reactStrictMode: false,
  output: "export",
  basePath,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
