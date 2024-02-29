import { TableCell, TableRow } from "@/components/ui/table";
import { ContractInfo } from "./contract-info";
import { OrderStatus } from "./order-stauts";
import { ContractAdd } from "./contract-add";
import { ConfirmedDelete } from "./alert-dialog-content";
import { Prisma } from "@prisma/client";
import { formatMoney } from "@/lib/formart-money";
import { getNameModality } from "../util/get-name-modality";

interface TableRowContactProps {
  contract: Prisma.ContractGetPayload<{
    include: {
      status: true;
      modality: true;
    };
  }>;
}

export function TableRowContact({ contract }: TableRowContactProps) {
  return (
    <TableRow key={contract.id}>
      <TableCell>
        <ContractInfo contract={contract} statusName={contract.status.name} />
      </TableCell>
      <TableCell>{contract.document}</TableCell>
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
