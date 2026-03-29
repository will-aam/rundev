import { Marquee } from "@/components/ui/marquee";
// Importação dos ícones originais (Simple Icons) corrigidos
import {
  SiReact,
  SiSupabase,
  SiPrisma,
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiNodedotjs,
  SiMysql,
  SiPostgresql,
  SiDocker,
  SiLinux,
  SiGit,
  SiGithub,
  SiVite,
  SiNetlify,
  SiWordpress,
  SiFigma,
  SiMarkdown,
  SiVercel,
  SiPnpm,
  SiTauri,
  SiGithubactions,
  SiPython,
  SiScala,
  SiGrafana,
  SiGooglecloud,
  SiD3,
} from "react-icons/si";

// Importação dos ícones oficiais da Microsoft
import { VscVscode, VscAzure } from "react-icons/vsc";

// Lista de todas as tecnologias unificadas
const technologies = [
  // Frontend & Frameworks
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" }, // Alterado para branco
  { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Vite", icon: SiVite, color: "#646CFF" },

  // Backend, Databases & ORMs
  { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
  { name: "Prisma", icon: SiPrisma, color: "#FFFFFF" }, // Alterado para branco (fica mais visível)
  { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },

  // DevOps, Ferramentas & Cloud
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Linux", icon: SiLinux, color: "#FCC624" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "GitHub", icon: SiGithub, color: "#FFFFFF" }, // Alterado para branco
  { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
  { name: "VS Code", icon: VscVscode, color: "#007ACC" },
  { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
  { name: "Vercel", icon: SiVercel, color: "#FFFFFF" }, // Alterado para branco
  { name: "pnpm", icon: SiPnpm, color: "#F69220" },
  { name: "Tauri", icon: SiTauri, color: "#FFC131" },
  { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  { name: "WordPress", icon: SiWordpress, color: "#21759B" },
  { name: "Markdown", icon: SiMarkdown, color: "#FFFFFF" }, // Alterado para branco
  { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4" },
  { name: "Azure", icon: VscAzure, color: "#0089D6" },

  // Data Analyst
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Scala", icon: SiScala, color: "#DC322F" },
  { name: "D3.js", icon: SiD3, color: "#F9A03C" },
  { name: "Grafana", icon: SiGrafana, color: "#F46800" },
];

export function TechMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background py-10">
      {/* pauseOnHover faz o carrossel parar quando o rato passa por cima */}
      <Marquee pauseOnHover className="[--duration:40s]">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="mx-4 flex flex-col items-center justify-center gap-2"
          >
            <tech.icon
              className="h-12 w-12 transition-transform duration-300 hover:scale-110"
              style={{ color: tech.color }} // Aqui ele puxa o #FFFFFF que colocamos
            />
            <span className="text-sm font-medium text-muted-foreground">
              {tech.name}
            </span>
          </div>
        ))}
      </Marquee>

      {/* Gradientes nas bordas para dar o efeito de fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-background dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-background dark:from-background"></div>
    </div>
  );
}
