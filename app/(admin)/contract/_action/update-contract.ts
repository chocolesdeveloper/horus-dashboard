"use server";

import { authOptions } from "@/app/_utils/authOptions";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface updateContractProps {
  contract: {
    id: string;
    name: string;
    contracting: string;
    document: string;
    contractValue: number;
    refundAmount: number;
    companyHires: string;
    contractDate: Date | undefined;
    contractTerm: Date | undefined;
    executedDate?: Date | undefined;
    executedValue?: number;
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

  console.log(statusId);

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
      id: contract.id,
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

  return { updatedContract };
}
