"use client";

import {
  TrendingDownIcon,
  TrendingUpIcon,
  ReceiptText,
  Receipt,
} from "lucide-react";

import {
  Card as CardUI,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import CountUp from "react-countup";
import { useEffect, useState } from "react";

interface CardProps {
  description: string;
  value: number;
  type?: "total" | "income" | "expense" | "contract";
}

export function Card({ description, value, type }: CardProps) {
  // TODO: criar um hook para o mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <CardUI className="flex h-32 flex-col justify-between p-5 shadow-lg">
      <CardDescription>{description}</CardDescription>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          {mounted && (
            <CountUp
              start={0}
              end={value}
              decimals={type !== "contract" ? 2 : 0}
              separator="."
              decimal=","
              prefix={type !== "contract" ? "R$ " : ""}
              duration={4}
              delay={2}
            >
              {({ countUpRef }) => <span ref={countUpRef} />}
            </CountUp>
          )}

          {type === "expense" && <TrendingUpIcon className="text-green-500" />}
          {type === "income" && <TrendingDownIcon className="text-red-500" />}
          {type === "contract" && <ReceiptText className="" />}
          {type === "total" && <Receipt className="" />}
        </CardTitle>
      </CardHeader>
    </CardUI>
  );
}
