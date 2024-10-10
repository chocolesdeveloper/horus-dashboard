"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/authOptions";

import { db } from "@/app/lib/prisma";

export async function GetStaffServer(id: string) {
  const data = await getServerSession(authOptions);

  if (!data) {
    throw new Error("User not authenticated");
  }

  const staff = await db.staff.findFirst({
    where: {
      id,
    },
  });

  if (!staff) {
    return null;
  }

  return staff;
}
