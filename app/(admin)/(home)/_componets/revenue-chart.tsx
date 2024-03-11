"use client";

import colors from "tailwindcss/colors";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Contract, Prisma } from "@prisma/client";
import { SelectType } from "./select-type";
import { useRouter } from "next/navigation";
import { SelectStatus } from "./select-status";

interface RevenueChartProps {
  contracts: Contract[];
}

export function RevenueChart({ contracts }: RevenueChartProps) {
  const [modality, setModality] = useState<string | undefined>(undefined);
  const [selectStatus, setSelectStatus] = useState<string | undefined>(
    undefined,
  );

  const router = useRouter();

  const dataRechart =
    contracts &&
    contracts.map((contract) => {
      return {
        name: contract.name,
        receipt: new Prisma.Decimal(String(contract.contractValue)),
      };
    });

  useEffect(() => {
    if (!modality && !selectStatus) {
      return router.push("/");
    }

    const modalityUrl = !["auction", "bidding", "private"].includes(modality!)
      ? ""
      : `modality=${modality}`;

    const statusUrl = !["progress", "concluded", "finished"].includes(
      selectStatus!,
    )
      ? ""
      : `&status=${selectStatus}`;

    router.push(`/?${modalityUrl}${statusUrl}`);
  }, [modality, router, selectStatus]);

  const error = console.error;
  console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <div className="flex flex-col items-end gap-4">
      <Card className="w-full py-6">
        <CardContent>
          {dataRechart.length > 0 ? (
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={dataRechart ?? []} style={{ fontSize: 12 }}>
                <YAxis
                  stroke="#888"
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  tickFormatter={(value: number) =>
                    value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  dy={16}
                  dx={16}
                />
                <CartesianGrid vertical={false} className="stroke-muted" />

                <Line
                  type="linear"
                  strokeWidth={2}
                  dataKey="receipt"
                  stroke={colors.violet[500]}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[340px] items-center justify-center">
              Parece que você não tem contratos, tente mudar o filtro.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <div className="w-56">
          <SelectStatus onChangeStatus={setSelectStatus} />
        </div>

        <div className="w-56">
          <SelectType onChangeType={setModality} />
        </div>
      </div>
    </div>
  );
}
