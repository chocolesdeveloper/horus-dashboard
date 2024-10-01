import { TableCell, TableRow } from "@/components/ui/table";
import { ContractInfo } from "./contract-info";
import { OrderStatus } from "./order-stauts";
import { ContractAdd } from "./contract-add";
import { ConfirmedDelete } from "./alert-dialog-content";
import { Prisma } from "@prisma/client";
import { formatMoney } from "@/app/(admin)/_utils/formart-money";
import { getNameModality } from "../_utils/get-name-modality";
import { replaceDocument } from "../../_utils/replace-document";
import { getUpdateModality } from "../../db/update";

interface TableRowContactProps {
  contract: Prisma.ContractGetPayload<{
    include: {
      status: true;
      modality: true;
    };
  }>;
}

export async function TableRowContact({ contract }: TableRowContactProps) {
  let documentReplace = "";

  if (contract.document.length === 11) {
    documentReplace = replaceDocument(contract.document, true);
  } else {
    documentReplace = replaceDocument(contract.document, false);
  }

  return (
    <TableRow key={contract.id}>
      <TableCell>
        <ContractInfo contract={contract} />
      </TableCell>
      <TableCell>{documentReplace}</TableCell>
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
