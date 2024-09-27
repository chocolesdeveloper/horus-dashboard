"use client";

import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { useNewContract } from "../hooks/use-new-contract";

export function ButtonCreate() {
  const { onOpen } = useNewContract();

  return (
    <Button
      variant="horus"
      className="flex w-full items-center gap-3 border bg-white text-black transition-all hover:bg-transparent hover:text-white hover:opacity-95 lg:w-fit"
      onClick={onOpen}
    >
      <PlusCircleIcon size={20} />
      Criar contrato
    </Button>
  );
}
