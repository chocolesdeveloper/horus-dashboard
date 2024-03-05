"use server";

import { db } from "@/app/lib/prisma";

export async function updateIsFinished(statusId: string) {
  await db.status.update({
    where: {
      id: statusId,
    },
    data: {
      name: "finished",
    },
  });
}
