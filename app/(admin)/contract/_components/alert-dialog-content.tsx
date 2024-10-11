"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteContract } from "../_action/delete-contract";
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";

interface ConfirmedDeleteProps {
  contractId: string;
}

export function ConfirmedDelete({ contractId }: ConfirmedDeleteProps) {
  const { data: user } = useSession();

  async function handleClick() {
    try {
      deleteContract(contractId);

      toast.success("Contrato excluído com sucesso.");
    } catch (error) {
      console.log(error);

      toast.error("Aconteceu um erro, tente novamente mais tarde.");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={user?.user.role !== 1}
          variant="ghost"
          className="flex w-full items-center gap-2 px-2 text-accent-foreground transition-all hover:my-2 hover:scale-105 hover:border hover:bg-rose-200/20 hover:text-destructive hover:shadow-xl"
        >
          <Trash2Icon size={18} />
          Deletar contrato
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Quer realmente deletar esse registro?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Depois que deletado o contrato não poderá ser recuperado, e será
            apagado por completo do banco de dados, tem certeza que deseja
            continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Voltar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClick}
            className="bg-destructive text-destructive-foreground hover:bg-destructive hover:text-accent"
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
