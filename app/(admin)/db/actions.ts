"use server";

import { db } from "@/app/lib/prisma";

export async function getModalitiesServer() {
  const data = await db.modality.findMany();

  return data;
}
