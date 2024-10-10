import { useEffect, useState } from "react";

import { useUpdateStaff } from "../hooks/use-update-staff";

import { Staff } from "@prisma/client";
import { GetStaffServer } from "../staff-management/_action/get-staff";

import { useForm, FormProvider, Controller } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputSimple } from "@/components/input-simple";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useMountedState } from "react-use";
import { UpdateStaffServer } from "../staff-management/_action/update-staff";

const updateStaffSchema = z.object({
  name: z
    .string()
    .min(1, "Campo não pode ficar em branco.")
    .max(30, "Nome muito grande."),
  email: z.string().email("Insira um e-mail válido."),
  password: z.string().min(1, "Campo não pode ficar em branco."),
  status: z.boolean(),
});

type UpdateStaffType = z.infer<typeof updateStaffSchema>;

export function UpdateStaff() {
  const { isOpen, onClose, id } = useUpdateStaff();
  const [staff, setStaff] = useState<Staff | null>(null);
  const isMounted = useMountedState();

  const methods = useForm<UpdateStaffType>({
    resolver: zodResolver(updateStaffSchema),
    values: {
      name: staff?.name ? staff.name : "",
      email: staff?.email ? staff.email : "",
      password: staff?.password ? staff.password : "",
      status: !!staff?.status,
    },
  });
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  async function handleFormSubmit(data: UpdateStaffType) {
    const { name, email, password, status } = data;

    try {
      const staff = await UpdateStaffServer({
        id,
        name,
        email,
        password,
        status,
      });

      reset();
      onClose();

      toast.success(`O usuário(a):${staff.name} foi alterado(a) com sucesso!`);
    } catch (error) {
      console.log(error);
      toast.error("Ops, algo deu errado. Tente novamente mais tarde.");
    }
  }

  function onCloseModal() {
    onClose();
  }

  useEffect(() => {
    async function getStaffs() {
      const staff = await GetStaffServer(id!);
      setStaff(staff);
    }

    if (isMounted()) {
      getStaffs();
    }
  }, [id, isMounted, isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onCloseModal}>
        <DialogContent className="w-[90%] md:h-auto md:max-w-lg">
          {staff === undefined ? (
            <div>
              <Loader2 className="size-4 animate-spin" />
            </div>
          ) : (
            <>
              <DialogHeader className="border-b pb-4 ">
                <DialogTitle>Atualizar membro</DialogTitle>
              </DialogHeader>

              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="flex w-full flex-col gap-3"
                >
                  <InputSimple name="name" label="Nome" />
                  <InputSimple
                    name="email"
                    label="Email"
                    placeholder="john@john.com"
                  />
                  <InputSimple
                    name="password"
                    label="Senha"
                    placeholder="************"
                  />

                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <div className="flex-items flex gap-4 self-center">
                        <Badge variant={field.value ? "active" : "destructive"}>
                          {field.value ? "Ativo" : "Inativo"}
                        </Badge>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    )}
                  />

                  <Button
                    variant="horus"
                    type="submit"
                    className="mt-4"
                    disabled={staff === undefined || isSubmitting}
                  >
                    Atualizar membro
                  </Button>
                </form>
              </FormProvider>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
