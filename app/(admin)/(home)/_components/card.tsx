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

interface CardProps {
  description: string;
  value: string | number;
  type?: "total" | "income" | "expense" | "contract";
}

export function Card({ description, value, type }: CardProps) {
  console.log(Number(value));

  return (
    <CardUI className="flex h-32 flex-col justify-between p-5 shadow-lg">
      <CardDescription>{description}</CardDescription>
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <CountUp
            start={0}
            end={Number(value)}
            decimals={type !== "contract" ? 2 : 0}
            separator="."
            decimal=","
            prefix={type !== "contract" ? "R$ " : ""}
            duration={4}
          >
            {({ countUpRef, start }) => <span ref={countUpRef} />}
          </CountUp>

          {type === "expense" && <TrendingUpIcon className="text-green-500" />}
          {type === "income" && <TrendingDownIcon className="text-red-500" />}
          {type === "contract" && <ReceiptText className="" />}
          {type === "total" && <Receipt className="" />}
        </CardTitle>
      </CardHeader>
    </CardUI>
  );
}
