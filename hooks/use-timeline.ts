"use client";

import { useState, useEffect, useCallback } from "react";
import type { TimelineEvent, Category, Tag } from "@/lib/types";
import {
  getCategoriesAction,
  addCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  getTagsAction,
  addTagAction,
  deleteTagAction,
  getEventsAction,
  addEventAction,
  updateEventAction,
  deleteEventAction,
} from "@/app/actions";

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega os dados do banco de dados ao iniciar
  useEffect(() => {
    async function loadData() {
      try {
        // Busca tudo em paralelo para ser mais rápido
        const [dbCategories, dbTags, dbEvents] = await Promise.all([
          getCategoriesAction(),
          getTagsAction(),
          getEventsAction(),
        ]);

        setCategories(dbCategories);
        setTags(dbTags);
        setEvents(dbEvents as TimelineEvent[]);
      } catch (error) {
        console.error("Erro ao carregar dados do banco:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  // Events
  const addEvent = useCallback(
    async (event: Omit<TimelineEvent, "id" | "createdAt">) => {
      const newEvent = await addEventAction(event);
      setEvents((prev) => [...prev, newEvent as TimelineEvent]);
    },
    [],
  );

  const updateEvent = useCallback(
    async (
      id: string,
      updates: Partial<Omit<TimelineEvent, "id" | "createdAt">>,
    ) => {
      const updatedEvent = await updateEventAction(id, updates);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? (updatedEvent as TimelineEvent) : e)),
      );
    },
    [],
  );

  const deleteEvent = useCallback(async (id: string) => {
    const success = await deleteEventAction(id);
    if (success) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  }, []);

  // Categories
  const addCategory = useCallback(async (category: Omit<Category, "id">) => {
    const newCategory = await addCategoryAction(category);
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback(
    async (id: string, updates: Partial<Category>) => {
      const updatedCategory = await updateCategoryAction(id, updates);
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updatedCategory : c)),
      );
    },
    [],
  );

  const deleteCategory = useCallback(async (id: string) => {
    const success = await deleteCategoryAction(id);
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    }
    return false; // Retorna falso se houver eventos associados
  }, []);

  // Tags
  const addTag = useCallback(async (name: string) => {
    const newTag = await addTagAction(name);
    // Evita duplicar no state se a tag já existia
    setTags((prev) => {
      if (prev.find((t) => t.id === newTag.id)) return prev;
      return [...prev, newTag];
    });
    return newTag;
  }, []);

  const deleteTag = useCallback(async (id: string) => {
    const success = await deleteTagAction(id);
    if (success) {
      setTags((prev) => prev.filter((t) => t.id !== id));
    }
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    if (a.startYear !== b.startYear) return a.startYear - b.startYear;
    if (a.startMonth && b.startMonth) return a.startMonth - b.startMonth;
    return 0;
  });

  const getCategory = useCallback(
    (id: string) => {
      return (
        categories.find((c) => c.id === id) || {
          id: "sem-categoria",
          name: "Sem Categoria",
          color: "slate",
          icon: "help_outline",
        }
      );
    },
    [categories],
  );

  return {
    events: sortedEvents,
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
  };
}
