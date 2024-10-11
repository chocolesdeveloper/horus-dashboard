"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ArrowLeftFromLineIcon, Search, SquarePenIcon, X } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { InfoComponent } from "./info";
import { UpdateContract } from "./update-contract";
import { IContractSerialized } from "@/app/types/contract-serialized";

interface ContractInfoProps {
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

export function ContractInfo({ contract }: ContractInfoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Search size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80%] overflow-y-auto">
        <DialogHeader className="mt-4">
          <DialogHeader>
            <button className="flex flex-row items-center gap-4">
              <h2 className="text-2xl tracking-tight">
                Contrato de {contract.contracting}
              </h2>
            </button>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-400">
            ID do contrato: {contract.id}
          </DialogDescription>
        </DialogHeader>

        <InfoComponent contract={contract} />
      </DialogContent>
    </Dialog>
  );
}
