import { formatMoney } from "@/app/(admin)/_utils/formart-money";
import { Card } from "./_componets/card";
import { CreateContract } from "./_componets/create-contract";
import { RevenueChart } from "./_componets/revenue-chart";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/authOptions";
import { redirect } from "next/navigation";

interface HomeProps {
  searchParams: {
    status: string;
    modality: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const modalitys = await db.modality.findMany();
  const contracts = await db.contract.findMany({
    where: {
      userId: session.user.id,
      status: {
        name: searchParams.status,
      },
      modality: {
        name: searchParams.modality,
      },
    },
  });

  const contractValueTotal = contracts.reduce((acc, value) => {
    return acc + Number(value.contractValue);
  }, 0);

  const contractRefundAmount = contracts.reduce((acc, value) => {
    return acc + Number(value.refundAmount);
  }, 0);

  const contractProfit = contractValueTotal - contractRefundAmount;

  return (
    <div className="container">
      <div className="flex items-center justify-between border-b">
        <h1 className="p-5 text-3xl font-bold tracking-tight">Home</h1>

        <CreateContract modalitys={modalitys} />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        <Card
          description="Valor de contratos totais"
          value={formatMoney(contractValueTotal)}
        />
        <Card
          description="Valor de desembolso"
          value={formatMoney(contractRefundAmount)}
          isUpOrDown="down"
        />
        <Card
          description="Lucro"
          value={formatMoney(contractProfit)}
          isUpOrDown="up"
        />
        <Card description="Total de contratos" value={contracts.length} />
      </div>

      <div className="mt-5">
        <RevenueChart contracts={contracts} />
      </div>
    </div>
  );
}
