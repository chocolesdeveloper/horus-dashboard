"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { ContractInfo } from "./contract-info";
import { OrderStatus } from "./order-stauts";
import { ContractAdd } from "./contract-add";
import { ConfirmedDelete } from "./alert-dialog-content";
import { formatMoney } from "@/app/(admin)/_utils/formart-money";
import { getNameModality } from "../_utils/get-name-modality";
import { replaceDocument } from "../../_utils/replace-document";
import { IContractSerialized } from "@/app/types/contract-serialized";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bolt, CircleEllipsis, Edit, Trash } from "lucide-react";
import { EditContract } from "./EditContract";

interface TableRowContactProps {
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

export function TableRowContact({ contract }: TableRowContactProps) {
  let documentReplace = "";

  if (contract.document.length === 11) {
    documentReplace = replaceDocument(contract.document, true);
  } else {
    documentReplace = replaceDocument(contract.document, false);
  }

  return (
    <TableRow key={contract.id} className="hover:bg-slate-200/30">
      <TableCell>
        <ContractInfo contract={contract} />
      </TableCell>
      <TableCell>{documentReplace}</TableCell>
      <TableCell>{contract.name}</TableCell>
      <TableCell>{formatMoney(contract.contractValue)}</TableCell>
      <TableCell>{getNameModality(contract.modality.name)}</TableCell>
      <TableCell>
        <OrderStatus status={contract.status.name} />
      </TableCell>
      <TableCell>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <CircleEllipsis className="size-5 rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-center p-2">
            <DropdownMenuItem
              asChild
              onClick={() => {}}
              className="flex items-center justify-center gap-2"
            >
              <ContractAdd contract={contract} />
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={() => {}}
              className="flex items-center justify-center gap-2"
            >
              <ConfirmedDelete contractId={contract.id} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <EditContract contract={contract} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
