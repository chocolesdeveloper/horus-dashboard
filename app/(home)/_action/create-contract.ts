"use server";

import { validateCnpj } from "@/app/contract/util/validate-cnpj";
import { validateCpf } from "@/app/contract/util/validate-cpf";
import { db } from "@/app/lib/prisma";
import { Contract, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface CreateContractProps {
  contract: Omit<
    Contract,
    "executedDate" | "executedValue" | "statusId" | "id" | "createdAt"
  >;
  isCpf?: boolean;
}

export async function createContract({
  contract,
  isCpf = false,
}: CreateContractProps): Promise<Contract | unknown> {
  const status = await db.status.findMany({
    where: {
      name: {
        contains: "progress",
      },
    },
  });

  if (isCpf) {
    let isValidateCpf = validateCpf(contract.document);

    if (!isValidateCpf) {
      return new NextResponse(
        JSON.stringify({
          error: "CPF inválido",
        }),
        {
          status: 401,
        },
      );
    }
  } else {
    let isValidateCnpj = validateCnpj(contract.document);

    if (isValidateCnpj) {
      return new NextResponse(
        JSON.stringify({
          error: "CNPJ inválido",
        }),
        {
          status: 401,
        },
      );
    }
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
      modalityId: contract.modalityId,
      statusId: status[0].id,
    },
  });

  revalidatePath("/");

  return { status: 201, contractCreate };
}
