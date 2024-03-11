export function formatMoney(money: number): string {
  const moneyWithDot = String(money).replace(/(.{2})$/, ".$1");

  return Number(moneyWithDot).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
