import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SearchFilter } from "./_components/search";
import { TableRowContact } from "./_components/table-row-contract";
import { db } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

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

  const contracts = await db.contract.findMany({
    where: {
      userId: session.user.id,
      document: {
        contains: searchParams.document,
      },
      name: {
        contains: searchParams.name,
        mode: "insensitive",
      },
      modality: {
        name: {
          contains: searchParams.modality,
          mode: "insensitive",
        },
      },
      status: {
        name: {
          contains: searchParams.status,
          mode: "insensitive",
        },
      },
    },
    include: {
      modality: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container flex flex-col gap-3">
      <h1 className="px-5 pt-5 text-3xl font-bold tracking-tight">Contratos</h1>

      <div className="px-5">
        <SearchFilter />
      </div>

      <div className="container flex max-h-[700px] w-full overflow-y-auto border border-secondary p-5 [&::-webkit-scrollbar-thumb]:bg-red-500">
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
  );
}
