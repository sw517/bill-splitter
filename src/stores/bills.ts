import { BillFrequency, type Bill } from '@/types/Bill';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

const blankBill = (): Bill => ({
  id: uuidv4(),
  name: '',
  cost: 0,
  frequency: BillFrequency.Monthly,
  belongsTo: [],
  paidBy: [],
});

export const useBillsStore = defineStore('bills', () => {
  const bills: Ref<Bill[]> = ref([blankBill()]);

  function editBill<Key extends keyof Bill>(id: Bill['id'], field: Key, input: Bill[Key]): void {
    const BillIndex: number = bills.value.findIndex((Bill: Bill) => Bill.id === id);
    if (BillIndex === -1) return;
    bills.value[BillIndex][field] = input;
  }

  return { bills, editBill };
});
