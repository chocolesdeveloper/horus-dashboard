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

interface ContractInfoProps {
  contract: Prisma.ContractGetPayload<{
    include: {
      status: true;
      modality: true;
    };
  }>;
}

export function ContractInfo({ contract }: ContractInfoProps) {
  const [isUpdate, setIsUpdate] = useState(false);

  function onUpdateContract() {
    setIsUpdate(false);
  }

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
            <button
              className="flex flex-row items-center gap-4"
              onClick={() => setIsUpdate(!isUpdate)}
            >
              <h2 className="text-2xl tracking-tight">
                Contrato de {contract.contracting}
              </h2>
              {isUpdate ? (
                <ArrowLeftFromLineIcon className="size-5 cursor-pointer transition-all hover:text-horus" />
              ) : (
                <SquarePenIcon className="size-5 cursor-pointer transition-all hover:text-horus" />
              )}
            </button>
          </DialogHeader>
          <DialogDescription className="text-sm text-gray-400">
            ID do contrato: {contract.id}
          </DialogDescription>
        </DialogHeader>

        {isUpdate ? (
          <UpdateContract
            contract={contract}
            onSuccessUpdate={onUpdateContract}
          />
        ) : (
          <InfoComponent contract={contract} />
        )}
      </DialogContent>
    </Dialog>
  );
}
