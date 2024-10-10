import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/authOptions";

import { db } from "@/app/lib/prisma";

import { redirect } from "next/navigation";

import { cache } from "react";

export const getContracts = cache(async (status: string, modality: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const data = await db.contract.findMany({
    where: {
      userId: session.user?.userId ? session.user?.userId : session.user.id,
      status: {
        name: status,
      },
      modality: {
        name: modality,
      },
    },
  });

  const serializedData = data.map((contract) => ({
    ...contract,
    contractValue: contract.contractValue.toString(),
    refundAmount: contract.refundAmount.toString(),
    executedValue: contract.executedValue?.toString() || null,
  }));

  return serializedData;
});

export const getContractFilter = cache(
  async (
    document?: string,
    name?: string,
    modality?: string,
    status?: string,
  ) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/login");
    }

    const data = await db.contract.findMany({
      where: {
        userId: session.user?.userId ? session.user?.userId : session.user.id,
        document: {
          contains: document,
        },
        name: {
          contains: name,
          mode: "insensitive",
        },
        modality: {
          name: {
            contains: modality,
            mode: "insensitive",
          },
        },
        status: {
          name: {
            contains: status,
            mode: "insensitive",
          },
        },
      },
      include: {
        modality: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedData = data.map((contract) => ({
      ...contract,
      contractValue: contract.contractValue.toString(),
      refundAmount: contract.refundAmount.toString(),
      executedValue: contract.executedValue?.toString() || null,
    }));

    return serializedData;
  },
);

export const getModality = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const data = await db.modality.findMany();

  return data;
});

export const getStaffs = cache(async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const staffs = await db.staff.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return staffs || [];
});
