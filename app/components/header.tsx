"use client";

import { Button } from "@/components/ui/button";
import { BookTextIcon, HomeIcon } from "lucide-react";
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

export function Header() {
  const pathname = usePathname();

  return (
    <header className="h-20 bg-background">
      <div className="container flex items-center justify-between px-8">
        <div></div>
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
        </div>
      </div>
    </header>
  );
}
