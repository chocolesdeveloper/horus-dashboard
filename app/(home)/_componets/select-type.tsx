"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectTypeProps {
  onChangeType: (value: string) => void;
}

export function SelectType({ onChangeType }: SelectTypeProps) {
  return (
    <Select defaultValue="none" onValueChange={onChangeType}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="none">Modalidade</SelectItem>
        <SelectItem value="auction">Pregão</SelectItem>
        <SelectItem value="bidding">Licitação</SelectItem>
        <SelectItem value="private">Privado</SelectItem>
      </SelectContent>
    </Select>
  );
}
