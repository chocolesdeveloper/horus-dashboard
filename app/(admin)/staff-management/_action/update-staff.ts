"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/authOptions";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateStaffProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  status: boolean;
}

export async function UpdateStaffServer({
  id,
  name,
  email,
  password,
  status,
}: UpdateStaffProps) {
  const data = await getServerSession(authOptions);

  if (!data) {
    throw new Error("User not authenticated");
  }

  if (!id) {
    throw new Error("Staff ID not provided");
  }

  const staff = await db.staff.update({
    where: { id },
    data: {
      name,
      email,
      password,
      status,
    },
  });

  revalidatePath("/");
  revalidatePath("/staff-management");

  return staff;
}
