import { Timeline } from "@/components/timeline";
import { TechMarquee } from "@/components/tech-marquee";
import { ProfileSidebar } from "@/components/profile-sidebar";

export default function Home() {
  return (
    // 'w-full' força a ocupar a largura toda.
    // 'pl-4 md:pl-8' garante que a sidebar fica arrumada ao canto esquerdo sem tocar na extremidade do ecrã.
    <main className="flex flex-row items-start py-12 pl-4 pr-4 md:pl-8 lg:pl-12 gap-8 lg:gap-16 w-full">
      {/* Sidebar na Esquerda (Colada) */}
      {/* min-w-[320px] impede que o conteúdo central a esmague */}
      <div className="hidden lg:block sticky top-12 min-w-[320px]">
        <ProfileSidebar />
      </div>

      {/* Conteúdo na Direita (Timeline e Marquee) */}
      {/* flex-1 faz com que esta div cresça para preencher todo o espaço restante */}
      <div className="flex flex-col gap-16 flex-1 max-w-7xl">
        <div className="w-full">
          <Timeline />
        </div>

        <div className="w-full">
          <TechMarquee />
        </div>
      </div>
    </main>
  );
}
