import { TableBody, TableRow, TableCell, Table } from "@/components/ui/table";
import { format } from "date-fns";
import { formatMoney } from "../../_utils/formart-money";
import { formatCpfCnpj } from "../_utils/format-cpf-cnpj";
import { OrderStatus } from "./order-stauts";
import { Prisma } from "@prisma/client";
import { MODALITIES } from "@/app/lib/constants";
import { IContractSerialized } from "@/app/types/contract-serialized";

interface InfoProps {
  contract: IContractSerialized & {
    status: {
      id: string;
      name: string;
    };
    modality: {
      id: string;
      name: string;
    };
  };
}

export function InfoComponent({ contract }: InfoProps) {
  const profit = Number(contract.contractValue) - Number(contract.refundAmount);
  const profitability = Math.round(
    (profit / Number(contract.contractValue)) * 100,
  );

  const modality = MODALITIES.find(
    (modality) => modality.value === contract.modality.name,
  );

  const remaining =
    Number(contract.contractValue) - Number(contract.executedValue);
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell className="flex justify-end">
            <OrderStatus status={contract.status.name} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Modalidade</TableCell>
          <TableCell className="flex justify-end">{modality?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Contrato</TableCell>
          <TableCell className="flex justify-end">{contract.name}</TableCell>
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
          <TableCell className="flex justify-end">{profitability}%</TableCell>
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
  );
}
