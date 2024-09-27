import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/app/_utils/utils";
import { Toaster } from "sonner";
import { Header } from "./_components/header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextAuthSessionProvider } from "@/providers/session-provider";
import { authOptions } from "@/app/_utils/authOptions";
import { DialogProvider } from "./providers/dialog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    absolute: "Home | Horus",
    template: "%s | Horus",
  },
};

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }

  return (
    <html lang="en">
      <body className={cn(inter.className)} suppressHydrationWarning>
        <NextAuthSessionProvider>
          <DialogProvider />
          <Header />
          {children}
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
