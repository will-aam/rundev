"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// =========================================
// CATEGORIAS
// =========================================
export async function getCategoriesAction() {
  return await prisma.category.findMany();
}

export async function addCategoryAction(data: {
  name: string;
  color: string;
  icon: string;
}) {
  const category = await prisma.category.create({ data });
  revalidatePath("/");
  return category;
}

export async function updateCategoryAction(
  id: string,
  data: { name?: string; color?: string; icon?: string },
) {
  const category = await prisma.category.update({ where: { id }, data });
  revalidatePath("/");
  return category;
}

export async function deleteCategoryAction(id: string) {
  // Verifica se existem eventos usando essa categoria antes de deletar
  const eventsCount = await prisma.timelineEvent.count({
    where: { categoryId: id },
  });
  if (eventsCount > 0) return false;

  await prisma.category.delete({ where: { id } });
  revalidatePath("/");
  return true;
}

// =========================================
// TAGS
// =========================================
export async function getTagsAction() {
  return await prisma.tag.findMany();
}

export async function addTagAction(name: string) {
  // O upsert tenta atualizar, se não achar, ele cria.
  // Isso evita erro de tag duplicada no banco de dados.
  const tag = await prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name },
  });
  revalidatePath("/");
  return tag;
}

export async function deleteTagAction(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/");
  return true;
}

// =========================================
// EVENTOS (MARCOS)
// =========================================
export async function getEventsAction() {
  const events = await prisma.timelineEvent.findMany({
    orderBy: [{ startYear: "asc" }, { startMonth: "asc" }],
  });

  // Converte a data do Prisma (DateTime) para Timestamp (number) para o frontend não quebrar
  return events.map((e) => ({
    ...e,
    createdAt: e.createdAt.getTime(),
  }));
}

export async function addEventAction(data: {
  startYear: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  title: string;
  description: string;
  details?: string;
  link?: string;
  tags?: string[];
  categoryId: string;
}) {
  const event = await prisma.timelineEvent.create({
    data: {
      ...data,
      tags: data.tags || [],
    },
  });
  revalidatePath("/");

  return {
    ...event,
    createdAt: event.createdAt.getTime(),
  };
}

export async function updateEventAction(id: string, data: any) {
  const event = await prisma.timelineEvent.update({ where: { id }, data });
  revalidatePath("/");

  return {
    ...event,
    createdAt: event.createdAt.getTime(),
  };
}

export async function deleteEventAction(id: string) {
  await prisma.timelineEvent.delete({ where: { id } });
  revalidatePath("/");
  return true;
}
