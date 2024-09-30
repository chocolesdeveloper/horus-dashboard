"use server";

import { authOptions } from "@/app/_utils/authOptions";
import { db } from "@/app/lib/prisma";
import { Contract } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateContractProps {
  contract: {
    name: string;
    contracting: string;
    document: string;
    contractValue: string;
    refundAmount: string;
    companyHires: string;
    contractDate: Date | undefined;
    contractTerm: Date | undefined;
    executedDate?: Date | undefined;
    executedValue?: string;
    status: string;
    modality: string;
  };
}
export async function updateContract({ contract }: updateContractProps) {
  const user = await getServerSession(authOptions);

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!contract) {
    throw new Error("Contract not found");
  }

  const statusId = await db.status.findFirst({
    where: {
      name: contract.status,
    },
  });

  if (!statusId) {
    throw new Error("Status not found");
  }

  const modalityId = await db.modality.findFirst({
    where: {
      name: contract.modality,
    },
  });

  if (!modalityId) {
    throw new Error("Modality not found");
  }

  const updatedContract = await db.contract.update({
    where: {
      userId: user.user.id,
      id: "599d44e6-d11f-47ba-94c5-d9234c33c122",
    },
    data: {
      name: contract.name,
      companyHires: contract.companyHires,
      contracting: contract.contracting,
      document: contract.document,
      contractValue: contract.contractValue,
      refundAmount: contract.refundAmount,
      executedValue: contract.executedValue,
      contractDate: contract.contractDate,
      contractTerm: contract.contractTerm,
      executedDate: contract.executedDate,
      statusId: statusId.id,
      modalityId: modalityId.id,
    },
  });

  revalidatePath("/contract");

  return;
}
