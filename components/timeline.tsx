"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TimelineCard } from "./timeline-card";
import { AddEventDialog } from "./add-event-dialog";
import { SettingsDialog } from "./settings-dialog";
import { useTimeline } from "@/hooks/use-timeline";
import { cn } from "@/lib/utils";

// Cores vibrantes
const colorClasses: Record<string, string> = {
  teal: "bg-teal-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
  // Fallback para cores antigas
  primary: "bg-teal-500",
  "chart-1": "bg-orange-500",
  "chart-2": "bg-blue-500",
  "chart-3": "bg-purple-500",
  "chart-4": "bg-amber-500",
  "chart-5": "bg-rose-500",
};

export function Timeline() {
  const {
    events,
    categories,
    tags,
    isLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    deleteTag,
    getCategory,
  } = useTimeline();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        element.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [events]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filter events by selected categories
  const filteredEvents =
    selectedCategories.length > 0
      ? events.filter((e) => selectedCategories.includes(e.categoryId))
      : events;

  // Group events by year for the timeline
  const years = [...new Set(filteredEvents.map((e) => e.startYear))].sort(
    (a, b) => a - b,
  );

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Carregando sua jornada...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Minha Jornada
              </h1>
              <p className="text-muted-foreground mt-1">
                Uma linha do tempo do meu aprendizado e crescimento
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {events.length > 0 && (
                <>
                  {selectedCategories.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCategories([])}
                      className="text-muted-foreground hidden sm:flex"
                    >
                      Limpar filtros
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtrar</span>
                        {selectedCategories.length > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                            {selectedCategories.length}
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {categories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => toggleCategory(category.id)}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                colorClasses[category.color] || "bg-muted",
                              )}
                            />
                            {category.name}
                          </div>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}

              <SettingsDialog
                categories={categories}
                tags={tags}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
                onAddTag={addTag}
                onDeleteTag={deleteTag}
              />
              <AddEventDialog
                categories={categories}
                tags={tags}
                onAdd={addEvent}
                onAddTag={addTag}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="p-4 bg-card rounded-full mb-4">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Sua jornada comeca aqui
            </h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Adicione o primeiro marco da sua trajetoria de aprendizado.
              Registre cursos, livros, experiencias e tudo que contribuiu para
              quem voce e hoje.
            </p>
            <AddEventDialog
              categories={categories}
              tags={tags}
              onAdd={addEvent}
              onAddTag={addTag}
            />
          </div>
        ) : (
          <>
            {/* Year markers */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      const element = document.getElementById(`year-${year}`);
                      element?.scrollIntoView({
                        behavior: "smooth",
                        inline: "center",
                        block: "nearest",
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors whitespace-nowrap"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <p className="text-muted-foreground text-center">
                  Nenhum marco encontrado com os filtros selecionados.
                </p>
                <Button
                  variant="link"
                  onClick={() => setSelectedCategories([])}
                  className="mt-2"
                >
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <>
                {/* Timeline Container */}
                <div className="relative">
                  {/* Navigation buttons */}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("left")}
                    className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm",
                      !canScrollLeft && "opacity-0 pointer-events-none",
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll("right")}
                    className={cn(
                      "absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm",
                      !canScrollRight && "opacity-0 pointer-events-none",
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>

                  {/* Gradient overlays */}
                  <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent pointer-events-none z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent pointer-events-none z-10" />

                  {/* Scrollable Timeline */}
                  <div
                    ref={scrollRef}
                    className="overflow-x-auto scrollbar-hide px-6"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    <div className="relative flex items-start gap-8 py-8 min-w-max px-12">
                      {/* Linha horizontal contínua */}
                      <div className="absolute top-12 left-0 right-0 h-0.5 bg-border z-0" />

                      {filteredEvents.map((event, index) => {
                        const category = getCategory(event.categoryId);
                        const dotColor =
                          colorClasses[category.color] || "bg-teal-500";

                        return (
                          <div
                            key={event.id}
                            id={
                              index === 0 ||
                              filteredEvents[index - 1]?.startYear !==
                                event.startYear
                                ? `year-${event.startYear}`
                                : undefined
                            }
                            className="relative pt-10" // Afasta o card para baixo da linha
                          >
                            {/* Ponto integrado à linha (o fundo bg-background cria o "corte" na linha) */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-background px-4 flex items-center justify-center">
                              <div
                                className={cn("w-3 h-3 rounded-full", dotColor)}
                              />
                            </div>

                            <TimelineCard
                              event={event}
                              category={category}
                              categories={categories}
                              tags={tags}
                              onDelete={deleteEvent}
                              onUpdate={updateEvent}
                              onAddTag={addTag}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Sua jornada de aprendizado, documentada e preservada.
          </p>
        </div>
      </footer>
    </div>
  );
}
