import {
  BillFrequency,
  type Bill,
  type DebtStructure,
  type TotalOutgoings,
  SplitType,
} from '@/types/Bill';
import { type Person } from '@/types/Person';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { usePeopleStore } from './people';
import { mergeWith as _mergeWith } from 'lodash-es';

export const useBillsStore = defineStore('bills', () => {
  const peopleStore = usePeopleStore();
  const { people, defaultPayer } = storeToRefs(peopleStore);

  const blankBill = (): Bill => ({
    id: uuidv4(),
    name: '',
    cost: 0,
    frequency: BillFrequency.MONTHLY,
    belongsTo: people.value.map(({ id }) => id),
    paidBy: defaultPayer.value,
  });

  const bills: Ref<Bill[]> = ref([blankBill()]);
  const splitType: Ref<SplitType> = ref(SplitType.EQUAL);

  const getPersonById = peopleStore.getPersonById;

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
      const cost = bill.frequency === BillFrequency.MONTHLY ? bill.cost : bill.cost / 12;
      return {
        ...bill,
        frequency: BillFrequency.MONTHLY,
        cost,
      };
    });
  });

  const totalOutgoings = computed(() => {
    return billsMonthly.value.reduce((acc: TotalOutgoings, bill: Bill) => {
      if (!bill.paidBy) return acc;

      if (acc[bill.paidBy]) {
        return { ...acc, [bill.paidBy]: acc[bill.paidBy] + bill.cost / bill.paidBy.length };
      }
      return { ...acc, [bill.paidBy]: bill.cost / bill.paidBy.length };
    }, {});
  });

  const debtsByPersonId = computed(() =>
    billsMonthly.value.reduce((accDebtors: DebtStructure, bill: Bill) => {
      if (!bill.paidBy) return accDebtors;
      if (!bill.belongsTo.length) return accDebtors;
      if (bill.belongsTo.length === 1 && bill.belongsTo[0] === bill.paidBy) return accDebtors;

      const creditorId = bill.paidBy;
      return bill.belongsTo.reduce((acc, debtorId: Person['id']) => {
        return _mergeWith(
          {},
          accDebtors,
          { [debtorId]: { [creditorId]: getBillShare(bill, debtorId) } },
          (objValue, srcValue) => {
            if (typeof objValue === 'number') {
              return objValue + srcValue;
            }
          }
        );
      }, accDebtors);
    }, {})
  );

  function getBillShare(bill: Bill, personId: Person['id']) {
    if (!bill.belongsTo.includes(personId)) return 0;

    if (splitType.value === SplitType.EQUAL) {
      return parseFloat((bill.cost / bill.belongsTo.length).toFixed(2));
    } else {
      const income = getPersonById(personId)?.income;
      const totalIncomesOfBillUsers = people.value.reduce((acc: number, person: Person) => {
        if (bill.belongsTo.includes(person.id)) {
          return acc + person.income;
        }
        return acc;
      }, 0);
      if (!income || !totalIncomesOfBillUsers) return 0;
      const ratioShare = income / totalIncomesOfBillUsers;
      return parseFloat((bill.cost * ratioShare).toFixed(2));
    }
  }

  return {
    bills,
    addBill,
    editBill,
    billsMonthly,
    splitType,
    getBillShare,
    totalOutgoings,
    debtsByPersonId,
  };
});
