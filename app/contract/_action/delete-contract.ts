"use server";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteContract(contractId: string) {
  const contract = await db.contract.delete({
    where: {
      id: contractId,
    },
  });

  revalidatePath("/");

  return contract;
}
