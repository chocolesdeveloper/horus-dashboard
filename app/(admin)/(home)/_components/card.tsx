import {
  Card as CardUI,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

interface CardProps {
  description: string;
  value: string | number;
  isUpOrDown?: "up" | "down";
}

export function Card({ description, value, isUpOrDown }: CardProps) {
  return (
    <CardUI>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="flex items-center justify-between">
          {value}

          {isUpOrDown === "up" && <TrendingUpIcon className="text-green-500" />}
          {isUpOrDown === "down" && (
            <TrendingDownIcon className="text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
    </CardUI>
  );
}
