export function formatMoney(money: number | string): string {
  return Number(money).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });
}
