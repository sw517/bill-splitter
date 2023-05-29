import { BillFrequency, type Bill } from '@/types/Bill';
import { type Person } from '@/types/Person';
import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { usePeopleStore } from './people';

const blankBill = (): Bill => ({
  id: uuidv4(),
  name: '',
  cost: 0,
  frequency: BillFrequency.Monthly,
  belongsTo: [],
  paidBy: [],
});

export const useBillsStore = defineStore('bills', () => {
  const peopleStore = usePeopleStore();
  const people = peopleStore.people;

  const bills: Ref<Bill[]> = ref([blankBill()]);

  function addBill() {
    bills.value.push(blankBill());
  }

  function editBill<Key extends keyof Bill>(id: Bill['id'], field: Key, input: Bill[Key]): void {
    const BillIndex: number = bills.value.findIndex((Bill: Bill) => Bill.id === id);
    if (BillIndex === -1) return;
    bills.value[BillIndex][field] = input;
  }

  const billsMonthly: ComputedRef<Bill[]> = computed(() => {
    return bills.value.map((bill: Bill) => {
      const cost = bill.frequency === BillFrequency.Monthly ? bill.cost : bill.cost / 12;
      return {
        ...bill,
        frequency: BillFrequency.Monthly,
        cost,
      };
    });
  });

  const debtByPersonId = computed(() =>
    people.map((person: Person) => {
      const debts = billsMonthly.value.reduce((acc: object, bill: Bill) => {
        if (bill.paidBy.includes(person.id) || !bill.belongsTo.includes(person.id)) {
          return acc;
        }
        const billShare = bill.cost / bill.belongsTo.length;
        return bill.paidBy.reduce((newAcc: object, personId: Person['id']) => {
          if (acc[personId as keyof typeof acc]) {
            return { ...acc, [personId]: acc[personId as keyof typeof acc] + billShare };
          } else {
            return { ...acc, [personId]: billShare };
          }
        }, acc);
      }, {});
      return {
        [person.id]: debts,
      };
    })
  );

  return { bills, addBill, editBill, billsMonthly, debtByPersonId };
});
