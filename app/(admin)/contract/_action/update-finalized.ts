"use server";

import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";

interface updateFinaliezedProps {
  contractId: string;
  isPassed: boolean;
}

export async function updateFinalized() {
  const auth = await getServerSession();

  console.log(auth);
}
