export function validateCnpj(cnpj: string): boolean {
  const cleanedCnpj = cnpj.replace(/\D/g, "");

  if (cleanedCnpj.length !== 14) {
    return false;
  }

  // Validação do primeiro dígito verificador
  let sum = 0;
  let factor = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanedCnpj.charAt(i)) * factor--;
    if (factor < 2) {
      factor = 9;
    }
  }
  let remainder = sum % 11;
  let digit = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(cleanedCnpj.charAt(12)) !== digit) {
    return false;
  }

  // Validação do segundo dígito verificador
  sum = 0;
  factor = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanedCnpj.charAt(i)) * factor--;
    if (factor < 2) {
      factor = 9;
    }
  }
  remainder = sum % 11;
  digit = remainder < 2 ? 0 : 11 - remainder;
  if (parseInt(cleanedCnpj.charAt(13)) !== digit) {
    return false;
  }

  return true;
}
