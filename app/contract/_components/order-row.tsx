import { TableRow, TableCell } from "@/components/ui/table";
import { getNameModality } from "../util/get-name-modality";
import { formatMoney } from "../../../lib/formart-money";
import { formatCpfCnpj } from "../util/format-cpf-cnpj";
import { ConfirmedDelete } from "./alert-dialog-content";
import { ContractAdd } from "./contract-add";
import { ContractInfo } from "./contract-info";
import { OrderStatus } from "./order-stauts";
import { Contract, Prisma } from "@prisma/client";

interface OrderRowProps {
  contract: Prisma.ContractGetPayload<{}>;
}

export function OrderRow({ contract }: OrderRowProps) {
  return (
    <TableRow key={contract.id}>
      <TableCell>
        <ContractInfo contract={contract} />
      </TableCell>
      <TableCell>{formatCpfCnpj(contract.document)}</TableCell>
      <TableCell>{contract.name}</TableCell>
      <TableCell>{formatMoney(Number(contract.contractValue))}</TableCell>
      <TableCell>{getNameModality(contract.modality.name)}</TableCell>
      <TableCell>
        <OrderStatus status={contract.status.name} />
      </TableCell>
      <TableCell>
        <ContractAdd contract={contract} />
      </TableCell>
      <TableCell>
        <ConfirmedDelete contractId={contract.id} />
      </TableCell>
    </TableRow>
  );
}
