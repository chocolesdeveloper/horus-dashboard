"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/authOptions";

import { db } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateStaffProps {
  name: string;
  email: string;
  password: string;
}

export async function CreateStaffServer({
  name,
  email,
  password,
}: CreateStaffProps) {
  const data = await getServerSession(authOptions);

  if (!data) {
    throw new Error("User not authenticated");
  }

  const staff = await db.staff.create({
    data: {
      name,
      email,
      password,
      userId: data.user.id,
      role: 2,
    },
  });

  revalidatePath("/staff-management");

  return staff;
}
