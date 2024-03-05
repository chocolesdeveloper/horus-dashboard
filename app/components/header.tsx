"use client";

import { Button } from "@/components/ui/button";
import { BookTextIcon, DoorOpenIcon, HomeIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

function getDayPeriod() {
  const hour = new Date().getHours();

  if (hour > 7 && hour < 12) {
    return "Boa manhã";
  } else if (hour < 18) {
    return "Boa tarde";
  } else if (hour < 24) {
    return "Boa noite";
  } else {
    return "Boa madrugada";
  }
}

export function Header() {
  const { data } = useSession();

  const pathname = usePathname();

  const welcomePeriod = getDayPeriod();

  return (
    <header className="h-20 bg-background">
      <div className="container flex items-center justify-between px-8">
        <div>
          {welcomePeriod}, {data?.user.name}. Bem-vindo(a)!
        </div>
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                href={item.href}
                className="flex h-20 items-center"
                key={item.href}
              >
                <Button
                  variant={isActive ? "default" : "outline"}
                  className="flex items-center gap-2"
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
      </div>
    </header>
  );
}
