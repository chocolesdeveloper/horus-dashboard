export function replaceDocument(value: string, isCpf: boolean) {
  let cpfMask = "";
  let cnpjMask = "";

  if (value) {
    if (isCpf) {
      const onlyNumbers = value.replace(/\D/g, "");

      cpfMask = onlyNumbers.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        "$1.$2.$3-$4",
      );
    } else {
      const onlyNumbers = value.replace(/\D/g, "");

      cnpjMask = onlyNumbers.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5",
      );
    }
  }

  return isCpf ? cpfMask : cnpjMask;
}
