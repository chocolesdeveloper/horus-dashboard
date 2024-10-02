"use server";

import { db } from "@/app/lib/prisma";
import { Contract } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { IContractSerialized } from "@/app/types/contract-serialized";
import { documentValidate } from "@/app/_utils/validation";

interface CreateContractProps {
  contract: Omit<
    IContractSerialized,
    "executedDate" | "executedValue" | "statusId" | "id" | "createdAt"
  > & {
    modality?: string;
  };
  isCpf?: boolean;
}

export async function createContract({
  contract,
  isCpf = false,
}: CreateContractProps): Promise<Contract | unknown> {
  //TODO: chegar todo create contract

  const status = await db.status.findMany({
    where: {
      name: {
        contains: "progress",
      },
    },
  });

  const modalityId = await db.modality.findFirst({
    where: {
      name: contract.modalityId,
    },
  });

  if (!status || !modalityId) {
    throw new Error("Could not find status or modality");
  }

  const validation = documentValidate(contract.document, isCpf);

  if (!validation) {
    throw new Error("Document invalid");
  }

  const contractCreate = await db.contract.create({
    data: {
      name: contract.name,
      contracting: contract.contracting,
      document: contract.document,
      address: contract.address,
      contractValue: contract.contractValue,
      refundAmount: contract.refundAmount,
      companyHires: contract.companyHires,
      contractDate: contract.contractDate,
      contractTerm: contract.contractTerm,
      modalityId: modalityId.id,
      statusId: status[0]?.id,
      userId: contract.userId,
    },
  });

  revalidatePath("/");

  return { status: 201, contractCreate };
}
