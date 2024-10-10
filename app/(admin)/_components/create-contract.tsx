"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { toast } from "sonner";

import { CalendarIcon, Loader2Icon } from "lucide-react";

import CurrencyInput from "react-currency-input-field";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { replaceDocument } from "../_utils/replace-document";
import { withCentavos } from "../_utils/with-centavos";
import { documentValidate } from "@/app/_utils/validation";

import { cn } from "@/app/_utils/utils";

import { createContract } from "../(home)/_action/create-contract";
import { useNewContract } from "../hooks/use-new-contract";

import { MODALITIES } from "@/app/lib/constants";

const createContractSchema = z.object({
  modality: z.string().min(1),
  name: z.string().min(1),
  contracting: z.string().min(1),
  document: z.string().min(1),
  checkbox: z.boolean(),
  address: z.string().min(1),
  contractValue: z.string().min(1),
  refundAmount: z.string().min(1),
  companyHires: z.string().min(1),
});

type CreateContractType = z.infer<typeof createContractSchema>;

export function CreateContract() {
  const { isOpen, onClose } = useNewContract();

  const [contractDate, setContractDate] = useState<Date | undefined>(
    new Date(),
  );
  const [contractTerm, setContractTerm] = useState<Date | undefined>(undefined);

  const { data: user } = useSession();

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateContractType>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      address: "",
      checkbox: false,
      companyHires: "Horus Engenharia",
      contracting: "",
      contractValue: undefined,
      document: "",
      modality: "private",
      name: "",
      refundAmount: undefined,
    },
  });

  const isCpf = watch("checkbox");
  const document = watch("document");
  const valueDocument = useMemo(
    () => replaceDocument(document, isCpf),
    [document, isCpf],
  );

  const documentSelected = documentValidate(valueDocument, isCpf);

  async function handleFormSubmit(data: CreateContractType) {
    if (!contractDate) {
      return toast.error("Informe a data inicial do contrato.");
    }

    if (!contractTerm) {
      return toast.error("Informe a data final do contrato.");
    }

    if (!documentSelected) {
      return toast.error("O CPF/CNPJ está incorreto.");
    }

    const contractValue = withCentavos(data.contractValue);
    const refundAmount = withCentavos(data.refundAmount);

    try {
      await createContract({
        contract: {
          name: data.name,
          contracting: data.contracting,
          document: data.document.replace(/\D/g, ""),
          address: data.address,
          contractValue: contractValue,
          refundAmount: refundAmount,
          companyHires: data.companyHires,
          contractDate: contractDate,
          contractTerm: contractTerm!,
          modality: data.modality,
          userId: user?.user.id!,
        },
        isCpf,
      });

      reset();
      setContractTerm(undefined);

      toast.success("Contrato criado com sucesso.");
    } catch (error) {
      console.log(error);
      toast.error("Ops, algo deu errado, tente novamente mais tarde!");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-screen w-screen overflow-y-auto md:max-h-[80vh]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Novo contrato</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Modalidade:</span>
            <Controller
              control={control}
              name="modality"
              render={({ field: { value, onChange, disabled, name } }) => (
                <Select
                  name={name}
                  value={value}
                  onValueChange={onChange}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {MODALITIES.map((modality) => (
                      <SelectItem key={modality.value} value={modality.value}>
                        {modality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Nome:</span>
            <Input
              placeholder="Nome do contrato"
              {...register("name")}
              className={`${errors?.name && "focus-visible:ring-red-500"}`}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Contratante:</span>
            <Input
              placeholder="John Joe"
              {...register("contracting")}
              className={`${errors?.contracting && "focus-visible:ring-red-500"}`}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Endereço:</span>
            <Input
              placeholder="R. Qualquer uma, 566"
              {...register("address")}
              className={`${errors?.address && "focus-visible:ring-red-500"}`}
            />
          </label>
          <label htmlFor="" className="relative flex items-center gap-2">
            <span className="w-24 text-accent-foreground">CPF/CNPJ:</span>
            <Input
              placeholder={isCpf ? "000.000.000-00" : "00.000.000/0000-00"}
              className={cn(
                "flex-1",
                !documentSelected && "focus-visible:ring-red-500",
                errors?.document && "focus-visible:ring-red-500",
              )}
              value={valueDocument}
              {...register("document")}
            />

            <label
              htmlFor=""
              className="absolute right-2 flex items-center gap-2 border-l bg-white px-2 text-sm"
            >
              CPF
              <Input
                type="checkbox"
                className="h-4 w-4"
                {...register("checkbox")}
              />
            </label>
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">
              Valor do contrato:
            </span>
            <Controller
              control={control}
              name="contractValue"
              render={({ field }) => (
                <CurrencyInput
                  onValueChange={field.onChange}
                  value={field.value}
                  name={field.name}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors?.contractValue && "focus-visible:ring-red-500",
                  )}
                  placeholder="R$ 0.000.000"
                  prefix="R$"
                  allowDecimals
                />
              )}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">
              Valor desembolso:
            </span>
            <Controller
              control={control}
              name="refundAmount"
              render={({ field }) => (
                <CurrencyInput
                  onValueChange={field.onChange}
                  value={field.value}
                  name={field.name}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors?.contractValue && "focus-visible:ring-red-500",
                  )}
                  placeholder="R$ 0.000.000"
                  prefix="R$"
                  allowDecimals
                />
              )}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">
              Empresa contrata:
            </span>
            <Input
              placeholder="Horus"
              {...register("companyHires")}
              className={`${errors.companyHires && "focus-visible:ring-red-500"}`}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-24 text-accent-foreground">Data inicial:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full flex-1 justify-start text-left font-normal capitalize",
                    !contractDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 " />
                  {contractDate ? (
                    format(contractDate, "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Calendar
                  mode="single"
                  selected={contractDate}
                  onSelect={setContractDate}
                  initialFocus
                  className="capitalize"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-24 text-accent-foreground">Data final:</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full flex-1 justify-start text-left font-normal capitalize",
                    !contractTerm && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 " />
                  {contractTerm ? (
                    format(contractTerm, "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Calendar
                  mode="single"
                  selected={contractTerm}
                  onSelect={setContractTerm}
                  initialFocus
                  className="capitalize"
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </label>

          <Button type="submit" variant="horus" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                Cadastrando
                <Loader2Icon size={18} className="animate-spin" />
              </div>
            ) : (
              "Cadastrar"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
