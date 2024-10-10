"use server";

import { authOptions } from "@/app/_utils/authOptions";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function DeleteStaff(id: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Not authorized");
  }

  const staff = await db.staff.delete({
    where: {
      id,
    },
  });

  revalidatePath("/staff-management");

  return staff;
}
