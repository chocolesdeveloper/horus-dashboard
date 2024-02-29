"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectStatusProps {
  onChangeStatus: (status: string) => void;
}

export function SelectStatus({ onChangeStatus }: SelectStatusProps) {
  return (
    <Select defaultValue="none" onValueChange={onChangeStatus}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="none">Status</SelectItem>
        <SelectItem value="progress">Progresso</SelectItem>
        <SelectItem value="concluded">Concluído</SelectItem>
        <SelectItem value="finished">Finalizado</SelectItem>
      </SelectContent>
    </Select>
  );
}
