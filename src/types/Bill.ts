import type { Person } from './Person';

export enum SplitType {
  EQUAL = 'Equal',
  RATIO = 'Income Ratio',
}

export enum BillFrequency {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export interface TotalOutgoings {
  [creditorId: Person['id']]: number;
}
export interface CreditorStructure {
  [creditorId: Person['id']]: number;
}

export interface DebtStructure {
  [debtorId: Person['id']]: CreditorStructure;
}
export interface Bill {
  id: string;
  name: string;
  cost: number;
  frequency: BillFrequency;
  belongsTo: Person['id'][];
  paidBy?: Person['id'];
}
