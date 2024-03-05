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
