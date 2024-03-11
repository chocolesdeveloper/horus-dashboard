export function withCentavos(value: string): number {
  let valueFinal = "";

  if (value.includes(",")) {
    valueFinal = value.replace(/\D/g, "");
  } else {
    valueFinal = value.replace(/^(?!.*,)\d+$/, "$&00");
  }

  return Number(valueFinal) * 100;
}
