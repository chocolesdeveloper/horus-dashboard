"use client";

import { useState } from "react";

import { cn } from "@/app/_utils/utils";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { CalendarIcon, PlusCircleIcon } from "lucide-react";

import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

import { toast } from "sonner";

import CurrencyInput from "react-currency-input-field";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { UpdatePartialField } from "../_action/update-partial-field";
import { updateConcluded } from "../_action/update-concluded";
import { withCentavos } from "../../_utils/with-centavos";
import { formatMoney } from "../../_utils/formart-money";
import { IContractSerialized } from "@/app/types/contract-serialized";

const ContractAddSchema = z.object({
  executedDate: z.date().optional(),
  executedValue: z.string().min(1, "Adiciona algum valor no campo."),
});

type ContractAddFormType = z.infer<typeof ContractAddSchema>;

interface IContractSerializedWithStatus extends IContractSerialized {
  status: {
    id: string;
    name: string;
  };
}

interface ContractAddProps {
  contract: Pick<
    IContractSerializedWithStatus,
    "contractValue" | "executedValue" | "contractTerm" | "id" | "status"
  >;
}

export function ContractAdd({ contract }: ContractAddProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const remaining =
    Number(contract.contractValue) - Number(contract.executedValue);

  const valueFinished = formatMoney(remaining);

  const isPassed = isAfter(new Date(), contract.contractTerm);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContractAddFormType>({
    resolver: zodResolver(ContractAddSchema),
    defaultValues: {
      executedValue: "",
    },
  });

  async function handleUpdateContract(data: ContractAddFormType) {
    try {
      const contractResponse = await UpdatePartialField({
        contractId: contract.id,
        executedDate: date,
        executedValue: withCentavos(data.executedValue),
      });
      if (contractResponse.executedValue === contractResponse.contractValue) {
        updateConcluded(contractResponse.id);
      }
      reset();
      setDate(new Date());
      toast.success("Valor atualizado.");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex w-full items-center gap-2 px-2 text-accent-foreground transition-all hover:my-2 hover:scale-105 hover:border hover:bg-emerald-200/10 hover:text-primary hover:shadow-xl"
          variant="ghost"
          disabled={
            isPassed || contract.status.name === "finished" || remaining <= 0
          }
        >
          <PlusCircleIcon size={18} className="stroke-2" />
          Atualizar contrato
        </Button>
      </DialogTrigger>

      <DialogContent className="p-5">
        <DialogHeader>
          <DialogHeader className="flex-col items-center text-2xl tracking-tight">
            Atualização de execução
            <span className="text-sm">Valor restante {valueFinished}</span>
          </DialogHeader>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleUpdateContract)}
          className="flex w-full flex-col gap-4"
        >
          <label htmlFor="executedDate" className="flex items-center gap-2">
            <span className="w-12">Data</span>
            <Controller
              control={control}
              name="executedDate"
              render={() => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex-1 justify-start text-left font-normal capitalize",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 " />
                      {date ? (
                        format(date, "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="capitalize"
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </label>
          <label
            htmlFor="executedValue"
            className="flex flex-col items-center gap-2"
          >
            <div className="flex w-full items-center gap-3">
              <span className="w-12">Valor</span>
              <Controller
                control={control}
                name="executedValue"
                render={({ field }) => (
                  <CurrencyInput
                    onValueChange={field.onChange}
                    value={field.value}
                    name={field.name}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="R$ 0.000.000"
                    prefix="R$"
                    decimalScale={2}
                    decimalsLimit={2}
                    decimalSeparator=","
                    groupSeparator="."
                    intlConfig={{
                      locale: "pt-BR",
                      currency: "BRL",
                    }}
                  />
                )}
              />
            </div>

            <p className="text-xs text-red-500">
              {errors?.executedValue?.message}
            </p>
          </label>
          <DialogClose asChild>
            <Button
              className="w-full text-accent-foreground"
              variant="horus"
              type="submit"
            >
              Atualizar
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
