"use client";

import { useState } from "react";

import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { IContractSerialized } from "@/app/types/contract-serialized";
import { UpdateContract } from "./update-contract";

interface EditContractProps {
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

export function EditContract({ contract }: EditContractProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex w-full items-center gap-2 px-2 text-accent-foreground transition-all hover:my-2 hover:scale-105 hover:border hover:bg-slate-200/10 hover:shadow-xl"
          variant="ghost"
        >
          <Edit size={18} className="stroke-2" />
          Atualizar contrato
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] w-[90vw] overflow-auto">
        <UpdateContract contract={contract} onClose={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
