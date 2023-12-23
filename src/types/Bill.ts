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
  [personId: Person['id']]: number;
}
export interface DebtStructure {
  [debtorId: Person['id']]: number;
}

export interface DebtStructures {
  [debtorId: Person['id']]: DebtStructure;
}
export interface Bill {
  id: string;
  name: string;
  cost: number;
  frequency: BillFrequency;
  splitType: SplitType;
  belongsTo: Person['id'][];
  paidBy?: Person['id'];
}
