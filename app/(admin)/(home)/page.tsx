import { RevenueChart } from "./_components/revenue-chart";
import { getContracts } from "../db/queries";
import { ButtonCreate } from "../_components/button";
import { GridCard } from "./_components/grid-card";

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

  return (
    <div className="container relative -mt-32 space-y-6">
      <ButtonCreate />

      <GridCard contracts={contracts} />

      <div className="mt-5">
        <RevenueChart contracts={contracts} />
      </div>
    </div>
  );
}
