import { db } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const modalities = await db.modality.findMany();
    return NextResponse.json(modalities);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar modalidades" },
      { status: 500 },
    );
  }
}
