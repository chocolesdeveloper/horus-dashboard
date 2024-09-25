import { db } from "@/app/lib/prisma";

import { getServerSession } from "next-auth";

import { formatMoney } from "@/app/(admin)/_utils/formart-money";

import { Card } from "./_components/card";
import { authOptions } from "@/app/_utils/authOptions";
import { RevenueChart } from "./_components/revenue-chart";
import { CreateContract } from "./_components/create-contract";
import { getContracts, getModality } from "../db/queries";

interface HomeProps {
  searchParams: {
    status: string;
    modality: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const modalitys = await getModality();
  const contracts = await getContracts(
    searchParams.status,
    searchParams.modality,
  );

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
