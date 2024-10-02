export interface IContractSerialized {
  id: string;
  createdAt: Date;
  statusId?: string;
  userId: string;
  modalityId?: string;
  name: string;
  contracting: string;
  document: string;
  address: string;
  contractValue: string | number;
  refundAmount: string | number;
  companyHires: string;
  contractDate: Date;
  contractTerm: Date;
  executedDate?: Date | null;
  executedValue?: string | number | null;
}
