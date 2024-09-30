"use client";

import { signOut, useSession } from "next-auth/react";

import {
  AlignJustify,
  BookTextIcon,
  DoorOpenIcon,
  HomeIcon,
  X,
} from "lucide-react";

import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/app/_utils/utils";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: <HomeIcon size={18} />,
  },
  {
    label: "Contratos",
    href: "/contract",
    icon: <BookTextIcon size={18} />,
  },
];

export function Header() {
  const { data } = useSession();

  const pathname = usePathname();

  const day = formatDate(new Date(), "E', 'd 'de' LLLL", {
    locale: ptBR,
  });

  return (
    <header className="h-16 bg-horus pb-72 lg:h-20">
      <div className="container flex w-full flex-col justify-between gap-5 p-3 lg:gap-10 lg:py-5">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo-horus.png"
              alt="Logo Horus"
              width={80}
              height={30}
              className="hidden rounded-xl bg-white lg:block"
            />
            <Image
              src="/logo-horus.png"
              alt="Logo Horus"
              width={50}
              height={20}
              className="rounded-xl bg-white lg:hidden"
            />
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  href={item.href}
                  className="flex h-20 items-center"
                  key={item.href}
                >
                  <Button
                    variant={isActive ? "horus" : "outline"}
                    className={cn(
                      "flex items-center gap-2",
                      isActive &&
                        "border border-white bg-transparent text-white underline underline-offset-2",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            <Button variant="destructive" size="icon" onClick={() => signOut()}>
              <DoorOpenIcon size={18} />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger className="lg:hidden">
              <AlignJustify className="size-6" />
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between rounded-md px-4 py-16">
              <div className="flex w-full flex-col items-center gap-3 ">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      href={item.href}
                      className="flex w-full items-center "
                      key={item.href}
                    >
                      <SheetClose asChild>
                        <Button
                          variant={isActive ? "horus" : "ghost"}
                          className="flex flex-1 gap-2 border"
                        >
                          {item.icon}
                          {item.label}
                        </Button>
                      </SheetClose>
                    </Link>
                  );
                })}
              </div>

              <Button
                variant="destructive"
                size="icon"
                onClick={() => signOut()}
                className="flex w-full gap-2 px-6"
              >
                Sair
                <DoorOpenIcon size={18} />
              </Button>
            </SheetContent>
          </Sheet>
        </div>

        {pathname === "/" && (
          <div className=" flex flex-col items-center gap-2 text-sm lg:items-end lg:text-base">
            <div className="font-semibold text-black">
              Bem-vindo(a) novamente,{" "}
              <span className="text-base font-bold lg:text-xl">
                {data?.user.name}
              </span>
            </div>
            <span className="text-black">{day}</span>
          </div>
        )}
      </div>
    </header>
  );
}
