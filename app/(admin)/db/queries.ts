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
      userId: session.user.id,
      status: {
        name: status,
      },
      modality: {
        name: modality,
      },
    },
  });

  return data;
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
        userId: session.user.id,
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

    return data;
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
