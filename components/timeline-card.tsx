"use client";

import { useState } from "react";
import { ChevronDown, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditEventDialog } from "./edit-event-dialog";
import type { TimelineEvent, Category, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";

// Material Icon component
function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn("material-icons-outlined", className)}
      style={{ fontSize: "inherit" }}
    >
      {name}
    </span>
  );
}

// Cores vibrantes
const colorClasses: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  teal: {
    bg: "bg-teal-500/20",
    text: "text-teal-400",
    border: "border-teal-500/30",
    dot: "bg-teal-500",
  },
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    dot: "bg-purple-500",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
  },
  rose: {
    bg: "bg-rose-500/20",
    text: "text-rose-400",
    border: "border-rose-500/30",
    dot: "bg-rose-500",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    dot: "bg-cyan-500",
  },
  // Fallback para cores antigas
  primary: {
    bg: "bg-teal-500/20",
    text: "text-teal-400",
    border: "border-teal-500/30",
    dot: "bg-teal-500",
  },
  "chart-1": {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
  },
  "chart-2": {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    dot: "bg-blue-500",
  },
  "chart-3": {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    dot: "bg-purple-500",
  },
  "chart-4": {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
  },
  "chart-5": {
    bg: "bg-rose-500/20",
    text: "text-rose-400",
    border: "border-rose-500/30",
    dot: "bg-rose-500",
  },
};

interface TimelineCardProps {
  event: TimelineEvent;
  category: Category;
  categories: Category[];
  tags: Tag[];
  onDelete: (id: string) => Promise<void> | void;
  onUpdate: (
    id: string,
    updates: Partial<Omit<TimelineEvent, "id" | "createdAt">>,
  ) => Promise<void> | void;
  onAddTag: (name: string) => Promise<Tag> | Tag;
}

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function formatPeriod(event: TimelineEvent): string {
  let start = `${event.startYear}`;
  if (event.startMonth) {
    start = `${monthNames[event.startMonth - 1]} ${event.startYear}`;
  }

  if (event.endYear) {
    let end = `${event.endYear}`;
    if (event.endMonth) {
      end = `${monthNames[event.endMonth - 1]} ${event.endYear}`;
    }
    return `${start} - ${end}`;
  }

  return start;
}

export function TimelineCard({
  event,
  category,
  categories,
  tags,
  onDelete,
  onUpdate,
  onAddTag,
}: TimelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = colorClasses[category.color] || colorClasses["teal"];

  return (
    <div className="flex flex-col items-center">
      {" "}
      {/* pt-8 removido */}
      {/* Card */}
      <Card
        className={cn(
          "w-72 cursor-pointer transition-all duration-300 border-border/50",
          isExpanded && "ring-2 ring-primary/50",
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div
              className={cn(
                "p-2 rounded-lg border flex items-center justify-center",
                colors.bg,
                colors.text,
                colors.border,
              )}
            >
              <MaterialIcon name={category.icon} className="text-lg" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {formatPeriod(event)}
              </p>
            </div>
          </div>

          {/* Category Badge */}
          <Badge
            variant="outline"
            className={cn(
              "mb-2 text-xs",
              colors.bg,
              colors.text,
              colors.border,
            )}
          >
            {category.name}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 text-balance leading-tight">
            {event.title}
          </h3>

          {/* Description */}
          <p
            className={cn(
              "text-sm text-muted-foreground mb-3 transition-all duration-300",
              !isExpanded && "line-clamp-2",
            )}
          >
            {event.description}
          </p>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {event.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 3 && (
                <span className="text-xs px-2 py-0.5 text-muted-foreground">
                  +{event.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Expand indicator */}
          {(event.details || event.link) && (
            <div className="flex items-center justify-center">
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-300",
                  isExpanded && "rotate-180",
                )}
              />
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && (
            <div
              className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {event.details && (
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">
                  {event.details}
                </p>
              )}

              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-3"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ver link
                </a>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                <EditEventDialog
                  event={event}
                  categories={categories}
                  tags={tags}
                  onUpdate={onUpdate}
                  onAddTag={onAddTag}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir este marco?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acao nao pode ser desfeita. O marco &ldquo;
                        {event.title}&rdquo; sera removido permanentemente da
                        sua linha do tempo.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(event.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
