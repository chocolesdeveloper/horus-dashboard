"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const MODALITYS = [
  { name: "Privado", value: "private" },
  { name: "Pregão", value: "auction" },
  { name: "Licitação", value: "bidding" },
];

const STATUS = [
  { name: "Finalizado", value: "finished" },
  { name: "Em progresso", value: "progress" },
  { name: "Concluído", value: "concluded" },
];

const searchFilterSchema = z.object({
  document: z.string().optional(),
  name: z.string().optional(),
  modality: z.string().optional(),
  status: z.string().optional(),
});

type SearchFilterSchema = z.infer<typeof searchFilterSchema>;

export function SearchFilter() {
  const router = useRouter();

  const { handleSubmit, register, control, reset } =
    useForm<SearchFilterSchema>({
      resolver: zodResolver(searchFilterSchema),
    });

  function handleFilter(data: SearchFilterSchema) {
    const modality = !["private", "auction", "bidding"].includes(
      data.modality ?? "",
    )
      ? ""
      : data.modality;
    const status = !["finished", "progress", "concluded"].includes(
      data.status ?? "",
    )
      ? ""
      : data.status;

    router.push(
      `/contract?${data.document ? `document=${data.document.replace(/\D/g, "") || ""}` : ""}${data.name ? `&name=${data.name || ""}` : ""}${modality ? `&modality=${modality === "all" ? "" : modality}` : ""}${status ? `&status=${status}` : ""}`,
    );
  }

  function handleClearFilters() {
    reset({
      document: "",
      name: "",
      modality: "all",
      status: "all",
    });

    router.push("/contract");
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        className="flex flex-wrap items-center justify-center gap-4"
        onSubmit={handleSubmit(handleFilter)}
      >
        <Controller
          name="modality"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Modalidades</SelectItem>
                {MODALITYS.map((modality) => (
                  <SelectItem
                    value={modality.value}
                    key={modality.name}
                    className="capitalize"
                  >
                    {modality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field: { name, onChange, value, disabled } }) => (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="relative w-full lg:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                {STATUS.map((modality) => (
                  <SelectItem
                    value={modality.value}
                    key={modality.name}
                    className="relative z-50 capitalize"
                  >
                    {modality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          placeholder="CPF/CNPJ"
          className="w-full lg:w-[250px]"
          {...register("document")}
        />
        <Input
          placeholder="Nome do contrato"
          className="w-full lg:w-[250px]"
          {...register("name")}
        />

        <Button
          type="submit"
          variant="secondary"
          className="relative w-full lg:w-fit"
        >
          <SearchIcon className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleClearFilters}
          className="w-full lg:w-fit"
        >
          <X className="mr-2 h-4 w-4" />
          Remover
        </Button>
      </form>
    </div>
  );
}
