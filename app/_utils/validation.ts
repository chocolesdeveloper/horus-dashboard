export function documentValidate(
  document: string,
  isCpf: boolean = false,
): boolean {
  if (isCpf) {
    return validateCpf(document);
  } else {
    return validateCnpj(document);
  }

  return false;
}

export function validateCpf(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanedCpf = cpf.replace(/\D/g, "");

  // Verifica se o CPF tem 11 dígitos
  if (cleanedCpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanedCpf)) {
    return false;
  }

  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanedCpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) {
    digit = 0;
  }

  // Verifica se o primeiro dígito verificador está correto
  if (parseInt(cleanedCpf.charAt(9)) !== digit) {
    return false;
  }

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanedCpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) {
    digit = 0;
  }

  // Verifica se o segundo dígito verificador está correto
  if (parseInt(cleanedCpf.charAt(10)) !== digit) {
    return false;
  }

  // Retorna o CPF formatado
  return true;
}

function validateCnpj(cnpj: string): boolean {
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
