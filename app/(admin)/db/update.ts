import { db } from "@/app/lib/prisma";
import { isAfter } from "date-fns";
import { revalidatePath } from "next/cache";

export async function getUpdateModality() {
  const contracts = await db.contract.findMany();

  contracts.map(async (contract) => {
    const isExpired = isAfter(new Date(), new Date(contract.contractTerm));
    if (
      isExpired &&
      contract.statusId !== "dff39b3a-c5f9-40c5-a9cb-c6b264a0eeb6"
    ) {
      await db.contract.update({
        where: { id: contract.id },
        data: {
          statusId: "6a6e2deb-1563-4eeb-878f-da06d390d58b",
        },
      });
    }
  });

  revalidatePath("/contract");
}
