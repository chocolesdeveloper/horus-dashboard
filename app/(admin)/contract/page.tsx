import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SearchFilter } from "./_components/search";
import { TableRowContact } from "./_components/table-row-contract";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_utils/authOptions";
import { Metadata } from "next";
import { CreateContract } from "../(home)/_components/create-contract";
import { getContractFilter, getModality } from "../db/queries";
import { ButtonCreate } from "../_components/button";

export const metadata: Metadata = {
  title: "Contratos",
};

interface ContractPageProps {
  searchParams: {
    document?: string;
    name: string;
    modality?: string;
    status?: string;
  };
}
export default async function ContractPage({
  searchParams,
}: ContractPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const contracts = await getContractFilter(
    searchParams.document,
    searchParams.name,
    searchParams.modality,
    searchParams.status,
  );

  return (
    <div className="container relative -top-32 flex flex-col gap-3">
      <ButtonCreate />

      <div className="rounded-lg bg-white px-5 pt-5 shadow-xl">
        <SearchFilter />

        {/* TODO: add message where no contract */}

        <div className="container flex max-h-[700px] w-full overflow-auto border-secondary bg-white p-5 [&::-webkit-scrollbar-thumb]:bg-red-500">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]"></TableHead>
                <TableHead className="w-[150px]">CPF/CNPJ</TableHead>
                <TableHead className="w-[200px]">Nome do contrato</TableHead>
                <TableHead className="w-[200px]">Valor do contrato</TableHead>
                <TableHead className="w-[150px]">Modalidade</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[20px]"></TableHead>
                <TableHead className="w-[20px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRowContact contract={contract} key={contract.id} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
