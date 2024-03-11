export function formatCpfCnpj(document: string) {
  if (document.length === 11) {
    document = document.replace(/\D/g, ""); // Remove caracteres não numéricos
    document = document.replace(/(\d{3})(\d)/, "$1.$2"); // Insere ponto após os primeiros 3 dígitos
    document = document.replace(/(\d{3})(\d)/, "$1.$2"); // Insere ponto após os próximos 3 dígitos
    document = document.replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Insere hífen após os próximos 3 dígitos
    return document;
  }

  document = document.replace(/\D/g, ""); // Remove caracteres não numéricos
  document = document.replace(/^(\d{2})(\d)/, "$1.$2"); // Insere ponto após os primeiros 2 dígitos
  document = document.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3"); // Insere ponto após os próximos 3 dígitos
  document = document.replace(/\.(\d{3})(\d)/, ".$1/$2"); // Insere barra após os próximos 3 dígitos
  document = document.replace(/(\d{4})(\d)/, "$1-$2"); // Insere hífen após os próximos 4 dígitos
  return document;
}
