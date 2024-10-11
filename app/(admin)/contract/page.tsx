import { Metadata } from "next";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SearchFilter } from "./_components/search";
import { TableRowContact } from "./_components/table-row-contract";
import { ButtonCreate } from "../_components/button";

import { getContractFilter } from "../db/queries";
import { updateModality } from "../db/update";
import { NotAFile } from "@/components/not-a-file";

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
  await updateModality();

  const contracts = await getContractFilter(
    searchParams.document,
    searchParams.name,
    searchParams.modality,
    searchParams.status,
  );

  return (
    <div className="container -mt-32 flex flex-col gap-3 pb-10">
      <ButtonCreate />

      <div className="rounded-lg bg-white px-5 pt-5 shadow-xl">
        <SearchFilter />

        <div className="container flex max-h-[700px] w-full overflow-auto border-secondary bg-white p-5 ">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRowContact contract={contract} key={contract.id} />
              ))}
            </TableBody>
          </Table>
        </div>

        {contracts.length === 0 && (
          <NotAFile description="Tente pesquisar novamente ou crie um contrato." />
        )}
      </div>
    </div>
  );
}
