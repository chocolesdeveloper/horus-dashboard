import { Metadata } from "next";
import Image from "next/image";

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
    <div className="container -mt-32 flex flex-col gap-3">
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
          <div className="container flex h-[700px] w-full flex-col items-center justify-center overflow-auto border-secondary bg-white p-5 text-center">
            <Image
              src="/no-found.gif"
              alt="gato preto animado"
              width={300}
              height={300}
              className="object-cover"
            />

            <h3 className="text-xl lg:text-3xl">
              Parece que o <span className="font-bold">Mike</span> não achou
              nada aqui...
            </h3>

            <p className="text-sm lg:font-light">
              Tente pesquisar novamente ou crie um contrato.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
