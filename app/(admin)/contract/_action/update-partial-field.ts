"use server";

import { db } from "@/app/lib/prisma";
import { Contract, Prisma } from "@prisma/client";
import { error } from "console";
import { revalidatePath } from "next/cache";

interface UpdatePartialFieldProps {
  contractId: string;
  executedDate: Date | undefined;
  executedValue: number;
}

export async function UpdatePartialField({
  contractId,
  executedDate,
  executedValue,
}: UpdatePartialFieldProps): Promise<Contract> {
  const contract = await db.contract.findFirst({
    where: {
      id: contractId,
    },
  });

  if (!contract) {
    throw error;
  }

  const valueIsFinished =
    Number(contract?.contractValue) -
      (Number(contract?.executedValue) + Number(executedValue)) <
    0;

  const executedValueFinish = valueIsFinished
    ? contract.contractValue
    : Number(contract?.executedValue) + Number(executedValue);

  const contractUpdate = await db.contract.update({
    where: {
      id: contractId,
    },
    data: {
      executedDate,
      executedValue: executedValueFinish,
    },
  });

  revalidatePath("/contract");

  return contractUpdate;
}
