export function formatMoney(money: number): string {
  return money.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
