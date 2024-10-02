import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCpfCnpj } from "../_utils/format-cpf-cnpj";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/app/_utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { useState, useTransition } from "react";
import { updateContract } from "../_action/update-contract";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODALITIES, STATUS } from "@/app/lib/constants";
import { IContractSerialized } from "@/app/types/contract-serialized";
import { withCentavos } from "../../_utils/with-centavos";

const updateContractSchema = z.object({
  status: z.string().min(1),
  modality: z.string().min(1),
  name: z.string().min(1),
  companyHires: z.string().min(1),
  contracting: z.string().min(1),
  document: z.string().min(1),
  contractValue: z.string().min(1),
  refundAmount: z.string().min(1),
  executedValue: z.string().min(1),
});

type UpdateContractType = z.infer<typeof updateContractSchema>;

interface UpdateContractProps {
  contract: IContractSerialized & {
    status: {
      id: string;
      name: string;
    };
    modality: {
      id: string;
      name: string;
    };
  };
  onSuccessUpdate: () => void;
}

export function UpdateContract({
  contract,
  onSuccessUpdate,
}: UpdateContractProps) {
  const [pending, startTransition] = useTransition();

  const [contractDate, setContractDate] = useState<Date | undefined>(
    new Date(contract.contractDate),
  );
  const [contractTerm, setContractTerm] = useState<Date | undefined>(
    new Date(contract.contractTerm),
  );
  const [executedDate, setExecutedDate] = useState<Date | undefined>(
    new Date(contract.executedDate ?? new Date()),
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateContractType>({
    resolver: zodResolver(updateContractSchema),
    defaultValues: {
      status: contract.status.name,
      modality: contract.modality.name,
      name: contract.name,
      companyHires: contract.companyHires,
      contracting: contract.contracting,
      document: formatCpfCnpj(contract.document),
      contractValue: String(contract.contractValue),
      refundAmount: String(contract.refundAmount),
      executedValue: String(contract?.executedValue ?? "0"),
    },
  });

  async function handleUpdateContract(data: UpdateContractType) {
    const documentWithoutDot = data.document.replace(/\D/g, "");

    const contractUpdate = {
      ...data,
      id: contract.id,
      executedValue: withCentavos(data.executedValue),
      contractValue: withCentavos(data.contractValue),
      refundAmount: withCentavos(data.refundAmount),
      document: documentWithoutDot,
      contractDate,
      contractTerm,
      executedDate,
      status: data.status,
      modality: data.modality,
    };

    try {
      startTransition(() => {
        updateContract({
          contract: contractUpdate,
        });
      });

      onSuccessUpdate();

      toast.success("Atualizado com sucesso!");
    } catch (error) {
      console.error(error);

      toast.error("Parece que algo deu errado");
    }
  }

  return (
    <form onSubmit={handleSubmit(handleUpdateContract)}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell className="flex justify-end">
              <Controller
                control={control}
                name="status"
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
                      {STATUS.map(({ value, name }) => (
                        <SelectItem key={value} value={value}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Modalidade</TableCell>
            <TableCell className="flex justify-end">
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
                      {MODALITIES.map(({ value, name }) => (
                        <SelectItem key={value} value={value}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contrato</TableCell>
            <TableCell className="flex justify-end">
              <Input className="flex-1" {...register("name")} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Empresa contrata</TableCell>
            <TableCell className="flex justify-end">
              <Input className="flex-1" {...register("companyHires")} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell className="flex justify-end">
              <Input className="flex-1" {...register("contracting")} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPF/CNPJ</TableCell>
            <TableCell className="flex justify-end">
              <Input className="flex-1" {...register("document")} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Valor do contrato</TableCell>
            <TableCell>
              <Controller
                control={control}
                name="contractValue"
                render={({ field }) => (
                  <CurrencyInput
                    onValueChange={field.onChange}
                    value={field.value}
                    name={field.name}
                    className={cn(
                      "mx-auto flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    placeholder="R$ 0.000.000"
                    prefix="R$"
                    allowDecimals
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Valor do desembolso</TableCell>
            <TableCell className="flex justify-end">
              <Controller
                control={control}
                name="refundAmount"
                render={({ field }) => (
                  <CurrencyInput
                    onValueChange={field.onChange}
                    value={field.value}
                    name={field.name}
                    className={cn(
                      "mx-auto flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    placeholder="R$ 0.000.000"
                    prefix="R$"
                    allowDecimals
                  />
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Data inicial</TableCell>
            <TableCell className="flex justify-end">
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
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Data final</TableCell>
            <TableCell className="flex justify-end">
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
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Data executada</TableCell>
            <TableCell className="flex justify-end">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full flex-1 justify-start text-left font-normal capitalize",
                      !executedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 " />
                    {executedDate ? (
                      format(executedDate, "dd/MM/yyyy", {
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
                    selected={executedDate}
                    onSelect={setExecutedDate}
                    initialFocus
                    className="capitalize"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Valor executado</TableCell>
            <TableCell className="flex justify-end">
              <Controller
                control={control}
                name="executedValue"
                render={({ field }) => (
                  <CurrencyInput
                    onValueChange={field.onChange}
                    value={field.value}
                    name={field.name}
                    className={cn(
                      "mx-auto flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    placeholder="R$ 0.000.000"
                    prefix="R$"
                    allowDecimals
                  />
                )}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Button
        className="mt-2 w-full"
        variant="horus"
        type="submit"
        disabled={pending}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : "Atualizar"}
      </Button>
    </form>
  );
}
