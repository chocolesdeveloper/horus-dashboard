"use server";

import { db } from "@/app/lib/prisma";
import { Contract } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getContracts(
  query: string = "auction",
): Promise<Contract[]> {
  const contracts = await db.contract.findMany({
    where: {
      modality: {
        name: query,
      },
    },
    take: 7,
  });

  if (!contracts) {
    throw new Error("Contracts not found");
  }

  revalidatePath("/");

  return contracts;
}
