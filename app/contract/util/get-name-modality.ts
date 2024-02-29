export function getNameModality(modality: string) {
  return {
    private: "Privado",
    auction: "Pregão",
    bidding: "Licitação",
  }[modality];
}
