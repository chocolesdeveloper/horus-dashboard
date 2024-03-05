export function getNameStatus(modality: string) {
  return {
    progress: "Em progresso",
    concluded: "Concluído",
    finished: "Finalizado",
  }[modality];
}
