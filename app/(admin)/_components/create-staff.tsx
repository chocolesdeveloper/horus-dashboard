import { useNewStaff } from "../hooks/use-new-staff";

import { useForm, FormProvider } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputSimple } from "@/components/input-simple";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { CreateStaffServer } from "../staff-management/_action/create-staff";
import { toast } from "sonner";

const createStaffSchema = z.object({
  name: z
    .string()
    .min(1, "Campo não pode ficar em branco.")
    .max(30, "Nome muito grande."),
  email: z.string().email("Insira um e-mail válido."),
  password: z.string().min(1, "Campo não pode ficar em branco."),
});

type CreateStaffType = z.infer<typeof createStaffSchema>;

export function CreateStaff() {
  const { isOpen, onClose } = useNewStaff();

  const methods = useForm<CreateStaffType>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  async function handleFormSubmit(data: CreateStaffType) {
    const { name, email, password } = data;

    try {
      const staff = await CreateStaffServer({
        name,
        email,
        password,
      });

      reset();
      onClose();

      toast.success(`O usuário(a): ${staff.name} foi criado(a) com sucesso!`);
    } catch (error) {
      console.log(error);
      toast.error("Ops, algo deu errado. Tente novamente mais tarde.");
    }
  }

  function onCloseModal() {
    onClose();
    reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseModal}>
      <DialogContent className="w-[90%] md:h-auto md:max-w-lg">
        <DialogHeader className="border-b pb-4 ">
          <DialogTitle>Novo membro</DialogTitle>
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

            <Button
              variant="horus"
              type="submit"
              className="mt-4"
              disabled={isSubmitting}
            >
              Criar membro
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
