type OrderStatus = "finished" | "progress" | "concluded" | string;

interface OrderStatusProps {
  status: OrderStatus;
}

export function OrderStatus({ status }: OrderStatusProps): React.ReactNode {
  const statusName = {
    finished: "Finalizado",
    progress: "Em progresso",
    concluded: "Concluído",
  }[status];

  return (
    <div className="flex items-center gap-2">
      {statusName === "Finalizado" && (
        <span className="h-3 w-3 rounded-full bg-destructive" />
      )}

      {statusName === "Concluído" && (
        <span className="h-3 w-3 rounded-full bg-primary" />
      )}

      {statusName === "Em progresso" && (
        <span className="h-3 w-3 rounded-full bg-yellow-400" />
      )}

      <span>{statusName}</span>
    </div>
  );
}
