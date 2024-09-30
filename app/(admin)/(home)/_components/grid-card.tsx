"use client";

import { Contract } from "@prisma/client";
import { Card } from "./card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface GridCardProps {
  contracts: Contract[];
}
export function GridCard({ contracts }: GridCardProps) {
  // TODO: criar um hook para o mounted
  const [isMounted, setIsMounted] = useState(true);

  const contractValueTotal = contracts.reduce((acc, value) => {
    return acc + Number(value.contractValue);
  }, 0);

  const contractRefundAmount = contracts.reduce((acc, value) => {
    return acc + Number(value.refundAmount);
  }, 0);

  const contractProfit = contractValueTotal - contractRefundAmount;

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if (isMounted) {
    return (
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
      <Card
        description="Valor de contratos totais"
        value={contractValueTotal}
        type="total"
      />
      <Card
        description="Valor de desembolso"
        value={contractRefundAmount}
        type="income"
      />
      <Card description="Lucro" value={contractProfit} type="expense" />
      <Card
        description="Total de contratos"
        value={contracts.length}
        type="contract"
      />
    </div>
  );
}
