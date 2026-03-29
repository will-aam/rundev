import { Timeline } from "@/components/timeline";
import { TechMarquee } from "@/components/tech-marquee"; // Ajuste o caminho se necessário

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 gap-16 md:px-8">
      {/* Seção da Timeline */}
      <div className="w-full max-w-8xl">
        <Timeline />
      </div>

      {/* Seção do Carrossel de Tecnologias */}
      <div className="w-full max-w-8xl">
        <TechMarquee />
      </div>
    </main>
  );
}
