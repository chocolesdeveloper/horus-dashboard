"use client";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";
/*
 * u/Desc: Sair e Administrador de Usuário do Lado do Cliente
 */

function SignOutAdminUserUserOnTheClientSide() {
  useEffect(() => {
    const run = async () => {
      toast("Não autorizado, faça login novamente");
      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    };

    run();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <Loader2 className="size-8 animate-spin" />
      </div>
    </div>
  );
}

export default SignOutAdminUserUserOnTheClientSide;
