import type { Person } from './Person';

export interface Bill {
  name: string;
  cost: number;
  frequency: 'monthly' | 'yearly';
  belongsTo: Person['id'][];
  paidBy: Person['id'][];
}
