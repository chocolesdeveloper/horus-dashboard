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

  const user = await db.user.findUnique({
    where: {
      email,
      password,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "User not found",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({ user });
}
