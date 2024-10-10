import { db } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schemaRequest = z.object({
  email: z.string().email("Email invalido."),
  password: z.string().min(1, "Password não pode está vazio."),
});

type RequestType = z.infer<typeof schemaRequest>;

export async function POST(req: Request) {
  const response: RequestType = await req.json();
  const { email, password } = response;

  email.toLocaleLowerCase();

  // Buscar admin
  const admin = await db.user.findUnique({
    where: {
      email,
      password,
      role: 1,
    },
  });

  if (admin) {
    return NextResponse.json({ user: admin });
  }

  // Buscar member
  const member = await db.staff.findUnique({
    where: {
      email,
      password,
      role: 2,
    },
  });

  if (!member?.status) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (member) {
    return NextResponse.json({ user: member });
  }

  return NextResponse.json({ message: "User not found" }, { status: 404 });
}
