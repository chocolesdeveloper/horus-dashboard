"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isAfter } from "date-fns";
import { Prisma } from "@prisma/client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/app/_utils/utils";
import { CalendarIcon, PlusCircleIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { UpdatePartialField } from "../_action/update-partial-field";
import { toast } from "sonner";
import { updateConcluded } from "../_action/update-concluded";
import CurrencyInput from "react-currency-input-field";
import { withCentavos } from "../../_utils/with-centavos";

const ContractAddSchema = z.object({
  executedDate: z.date().optional(),
  executedValue: z.string().min(1, "Adiciona algum valor no campo."),
});

type ContractAddFormType = z.infer<typeof ContractAddSchema>;

interface ContractAddProps {
  contract: Pick<
    Prisma.ContractGetPayload<{
      include: {
        status: true;
      };
    }>,
    "contractValue" | "executedValue" | "contractTerm" | "id" | "status"
  >;
}

export function ContractAdd({ contract }: ContractAddProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const remaining =
    Number(contract.contractValue) - Number(contract.executedValue);

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
          className="w-full px-2 text-accent-foreground"
          disabled={
            isPassed || contract.status.name === "finished" || remaining <= 0
          }
        >
          <PlusCircleIcon size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogHeader className="text-2xl tracking-tight">
            Atualização de contrato
          </DialogHeader>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleUpdateContract)}
          className="flex flex-col gap-4"
        >
          <label htmlFor="executedDate" className="flex items-center gap-2">
            <span className="w-32">Data executada:</span>
            <Controller
              control={control}
              name="executedDate"
              render={() => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] flex-1 justify-start text-left font-normal capitalize",
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
            <div className="flex w-full items-center gap-2">
              <span className="w-48">Valor executado:</span>
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
                    allowDecimals
                    decimalsLimit={2}
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
            <Button className="w-full text-accent-foreground" type="submit">
              Atualizar
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
