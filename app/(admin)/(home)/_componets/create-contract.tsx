"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, PlusCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { replaceDocument } from "../_utils/replace-document";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CurrencyInput from "react-currency-input-field";
import { Modality } from "@prisma/client";
import { createContract } from "../_action/create-contract";
import { toast } from "sonner";

import colors from "tailwindcss/colors";
import { validateCpf } from "../../contract/util/validate-cpf";
import { validateCnpj } from "../../contract/util/validate-cnpj";
import { getNameModality } from "../../contract/util/get-name-modality";
import { useSession } from "next-auth/react";

const createContractSchema = z.object({
  modalityId: z.string(),
  name: z.string(),
  contracting: z.string(),
  document: z.string(),
  checkbox: z.boolean(),
  address: z.string(),
  contractValue: z.coerce.number(),
  refundAmount: z.coerce.number(),
  companyHires: z.string(),
});

type CreateContractType = z.infer<typeof createContractSchema>;

interface CreateContractProps {
  modalitys: Modality[];
}

export function CreateContract({ modalitys }: CreateContractProps) {
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
    formState: { errors },
  } = useForm<CreateContractType>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      address: "",
      checkbox: false,
      companyHires: "",
      contracting: "",
      contractValue: undefined,
      document: "",
      modalityId: "",
      name: "",
      refundAmount: undefined,
    },
  });

  const isCpf = watch("checkbox");
  const document = watch("document");
  const valueDocument = replaceDocument(document, isCpf);

  let isValidateCpf = false;
  let isValidateCnpj = false;

  if (isCpf) {
    isValidateCpf = validateCpf(document);
  } else {
    isValidateCnpj = validateCnpj(document);
  }

  const documentSelected = isValidateCpf || isValidateCnpj;

  async function handleFormSubmit(data: any) {
    try {
      if (!contractDate) {
        return toast.error("Informe a data inicial do contrato.", {
          style: {
            background: colors.red["500"],
            color: "#fff",
          },
        });
      }

      if (!contractTerm) {
        return toast.error("Informe a data final do contrato.", {
          style: {
            background: colors.red["500"],
            color: "#fff",
          },
        });
      }

      await createContract({
        contract: {
          name: data.name,
          contracting: data.contracting,
          document: data.document,
          address: data.address,
          contractValue: data.contractValue,
          refundAmount: data.refundAmount,
          companyHires: data.companyHires,
          contractDate: contractDate,
          contractTerm: contractTerm!,
          modalityId: data.modalityId,
          userId: user?.user.id!,
        },
      });

      reset();
      setContractTerm(undefined);

      toast.success("Contrato criado com sucesso.");
    } catch (error) {
      console.error(error);
      toast.error("Ops, algo deu errado, tente novamente mais tarde!", {
        style: {
          background: colors.red["500"],
          color: "#fff",
        },
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-3">
          <PlusCircleIcon size={20} />
          Criar contrato
        </Button>
      </DialogTrigger>

      <DialogContent>
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
              name="modalityId"
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
                    {modalitys.map((modality) => (
                      <SelectItem key={modality.id} value={modality.id}>
                        {getNameModality(modality.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Nome:</span>
            <Input placeholder="Nome do contrato" {...register("name")} />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Contratante:</span>
            <Input placeholder="John Joe" {...register("contracting")} />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">Endereço:</span>
            <Input
              placeholder="R. Qualquer uma, 566"
              {...register("address")}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-24 text-accent-foreground">CPF/CNPJ:</span>
            <Input
              placeholder={isCpf ? "000.000.000-00" : "00.000.000/0000-00"}
              className={cn(
                "flex-1",
                !documentSelected && "focus-visible:ring-red-500",
              )}
              value={valueDocument}
              {...register("document")}
            />

            <label htmlFor="" className="flex items-center gap-2 text-sm">
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="R$ 0.000.000"
                  prefix="R$"
                  decimalsLimit={2}
                  intlConfig={{
                    locale: "pt-BR",
                    currency: "BRL",
                  }}
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="R$ 0.000.000"
                  prefix="R$"
                  decimalsLimit={2}
                  intlConfig={{
                    locale: "pt-BR",
                    currency: "BRL",
                  }}
                />
              )}
            />
          </label>
          <label htmlFor="" className="flex items-center gap-2">
            <span className="w-32 text-accent-foreground">
              Empresa contrata:
            </span>
            <Input placeholder="Horus" {...register("companyHires")} />
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

          <Button type="submit">Cadastrar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
