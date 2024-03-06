"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Insira um email valído."),
  password: z.string().min(1, "Password não pode está vazio."),
});

type LoginType = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  async function handleClickLogin(data: LoginType) {
    const result = await signIn("login", {
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      console.log("Error: " + result.error);
      toast.error("Parece que algo deu errado, verifique seu e-mail e senha.");
      return;
    }

    router.replace("/");
  }

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
          <CardDescription>Forneça os dados para login</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            className="flex flex-col"
            onSubmit={handleSubmit(handleClickLogin)}
          >
            <label htmlFor="email" className="flex gap-2">
              <span className="flex w-max items-center gap-2 text-nowrap text-sm text-gray-400">
                E-mail:
              </span>
              <Input
                type="text"
                id="email"
                placeholder="johnjoe@example.com"
                {...register("email")}
              />
            </label>
            {errors.email && (
              <p className="mt-1 text-center text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
            <label htmlFor="password" className="mt-2 flex gap-2">
              <span className="flex w-max items-center gap-2 text-nowrap text-sm text-gray-400">
                Senha:
              </span>
              <div className="flex items-center gap-2">
                <Input
                  id="password"
                  type={isShowPassword ? "text" : "password"}
                  placeholder="***********"
                  {...register("password")}
                />

                {isShowPassword ? (
                  <button
                    type="button"
                    onClick={() => setIsShowPassword(false)}
                  >
                    <EyeOffIcon size={18} />
                  </button>
                ) : (
                  <button type="button" onClick={() => setIsShowPassword(true)}>
                    <EyeIcon size={18} />
                  </button>
                )}
              </div>
            </label>
            {errors.password && (
              <p className="text-center text-xs text-red-500">
                {errors.password.message}
              </p>
            )}

            <Button className="mt-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="animate-spin">
                  <Loader2Icon />
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
