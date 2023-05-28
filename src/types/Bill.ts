import type { Person } from './Person';

export enum BillFrequency {
  Monthly = 'monthly',
  Yearly = 'yearly',
}

export interface Bill {
  id: string;
  name: string;
  cost: number;
  frequency: BillFrequency;
  belongsTo: Person['id'][];
  paidBy: Person['id'][];
}
