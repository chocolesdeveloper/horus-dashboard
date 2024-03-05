"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateConcluded(contractId: string) {
  const finishedStatus = await db.status.findFirst({
    where: {
      name: "concluded",
    },
    select: {
      id: true,
    },
  });

  if (!finishedStatus) {
    return null;
  }

  await db.contract.update({
    where: {
      id: contractId,
    },
    data: {
      statusId: finishedStatus.id,
    },
  });

  revalidatePath("/contract");
}
