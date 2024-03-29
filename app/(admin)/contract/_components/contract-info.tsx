import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

import { Search } from "lucide-react";
import { OrderStatus } from "./order-stauts";
import { Prisma } from "@prisma/client";
import { formatCpfCnpj } from "../_utils/format-cpf-cnpj";
import { formatMoney } from "@/app/(admin)/_utils/formart-money";

interface ContractInfoProps {
  contract: Prisma.ContractGetPayload<{
    include: {
      status: true;
    };
  }>;
}

export async function ContractInfo({ contract }: ContractInfoProps) {
  const profit = Number(contract.contractValue) - Number(contract.refundAmount);
  const profitability = Math.round(
    (profit / Number(contract.contractValue)) * 100,
  );

  const remaining =
    Number(contract.contractValue) - Number(contract.executedValue);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Search size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogHeader className="text-2xl tracking-tight">
            Contrato de {contract.contracting}
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-400">
            ID do contrato: {contract.id}
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell className="flex justify-end">
                <OrderStatus status={contract.status.name} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Contrato</TableCell>
              <TableCell className="flex justify-end">
                {contract.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Empresa contrata</TableCell>
              <TableCell className="flex justify-end">
                {contract.companyHires}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell className="flex justify-end">
                {contract.contracting}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CPF/CNPJ</TableCell>
              <TableCell className="flex justify-end">
                {formatCpfCnpj(contract.document)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valor do contrato</TableCell>
              <TableCell className="flex justify-end">
                {formatMoney(Number(contract.contractValue))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valor do desembolso</TableCell>
              <TableCell className="flex justify-end">
                {formatMoney(Number(contract.refundAmount))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valor do lucro</TableCell>
              <TableCell className="flex justify-end">
                {formatMoney(profit)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valor da rentabilidade</TableCell>
              <TableCell className="flex justify-end">
                {profitability}%
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Data inicial: {format(contract.contractDate, "dd/MM/yyyy")}
              </TableCell>
              <TableCell className="flex justify-end">
                Data final: {format(contract.contractTerm, "dd/MM/yyyy")}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Data executada</TableCell>
              <TableCell className="flex justify-end">
                {contract.executedDate
                  ? format(contract.executedDate, "dd/MM/yyyy")
                  : "Não executado"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Valor executado</TableCell>
              <TableCell className="flex justify-end">
                {contract.executedValue
                  ? formatMoney(Number(contract.executedValue))
                  : "R$ 0"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total restante</TableCell>
              <TableCell className="flex justify-end">
                {formatMoney(remaining < 0 ? 0 : remaining)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
