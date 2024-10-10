"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { Staff } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Edit, Trash, CircleEllipsis } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { DeleteStaff } from "../_action/delete-staff";
import { toast } from "sonner";
import { NotAFile } from "@/components/not-a-file";
import { useUpdateStaff } from "../../hooks/use-update-staff";

interface TabletStaffProps {
  staffs: Staff[];
}

export function TabletStaff({ staffs }: TabletStaffProps) {
  const { onOpen } = useUpdateStaff();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse membro?",
    "Depois de excluir não poderá voltar atrás com essa ação.",
  );

  async function deleteStaff(id: string) {
    const result = await confirm();
    document.body.style.pointerEvents = "auto";

    if (result) {
      const staff = await DeleteStaff(id);

      toast.success(`${staff.name} foi delatado com sucesso.`);

      return;
    }

    return;
  }

  return (
    <>
      <ConfirmDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffs.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>{staff.name}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>
                <Badge
                  variant={staff.status === true ? "active" : "destructive"}
                >
                  {staff.status === true ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <CircleEllipsis className="size-5 rotate-90" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => onOpen(staff.id)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Edit className="size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => deleteStaff(staff.id)}
                      className="flex items-center justify-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <Trash className="size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {staffs.length === 0 && (
        <NotAFile description="Parece que você não tem uma equipe." />
      )}
    </>
  );
}
