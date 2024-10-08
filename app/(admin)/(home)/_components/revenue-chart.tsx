"use client";

import colors from "tailwindcss/colors";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { SelectType } from "./select-type";
import { useRouter } from "next/navigation";
import { SelectStatus } from "./select-status";
import { IContractSerialized } from "@/app/types/contract-serialized";

interface RevenueChartProps {
  contracts: IContractSerialized[];
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
        receipt: Number(contract.contractValue),
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
    <div className="flex flex-col items-end gap-4 pb-10">
      <Card className="w-full py-6 shadow-lg">
        <CardContent>
          {dataRechart.length > 0 ? (
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={dataRechart ?? []} style={{ fontSize: 12 }}>
                <div className="hidden lg:block">
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
                </div>

                {/* <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  dy={16}
                  dx={16}
                /> */}
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
            <div className="flex h-[340px] items-center justify-center text-center">
              Parece que você não tem contratos, tente mudar o filtro.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex w-full justify-end gap-2">
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
