import { Card } from "./_components/card";
import { RevenueChart } from "./_components/revenue-chart";
import { getContracts } from "../db/queries";
import { ButtonCreate } from "../_components/button";

interface HomeProps {
  searchParams: {
    status: string;
    modality: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const contracts = await getContracts(
    searchParams.status,
    searchParams.modality,
  );

  if (!contracts) {
    return null;
  }

  const contractValueTotal = contracts.reduce((acc, value) => {
    return acc + Number(value.contractValue);
  }, 0);

  const contractRefundAmount = contracts.reduce((acc, value) => {
    return acc + Number(value.refundAmount);
  }, 0);

  const contractProfit = contractValueTotal - contractRefundAmount;

  return (
    <div className="container relative -mt-32 space-y-6">
      <ButtonCreate />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <Card
          description="Valor de contratos totais"
          value={contractValueTotal}
          type="total"
        />
        <Card
          description="Valor de desembolso"
          value={contractRefundAmount}
          type="income"
        />
        <Card description="Lucro" value={contractProfit} type="expense" />
        <Card
          description="Total de contratos"
          value={contracts.length}
          type="contract"
        />
      </div>

      <div className="mt-5">
        <RevenueChart contracts={contracts} />
      </div>
    </div>
  );
}
