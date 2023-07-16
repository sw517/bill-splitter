import {
  BillFrequency,
  type Bill,
  type DebtStructure,
  type DebtStructures,
  type TotalOutgoings,
  SplitType,
} from '@/types/Bill';
import { type Person } from '@/types/Person';
import { defineStore } from 'pinia';
import { computed, ref, type ComputedRef, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { usePeopleStore } from './people';
import { mergeWith as _mergeWith } from 'lodash-es';

export const useBillsStore = defineStore('bills', () => {
  function blankBill(): Bill {
    const peopleStore = usePeopleStore();
    return {
      id: uuidv4(),
      name: '',
      cost: 0,
      frequency: BillFrequency.MONTHLY,
      belongsTo: peopleStore.people.map(({ id }) => id),
      paidBy: peopleStore.defaultPayer,
    };
  }

  const bills: Ref<Bill[]> = ref([blankBill()]);
  const splitType: Ref<SplitType> = ref(SplitType.EQUAL);

  function addBill() {
    bills.value.push(blankBill());
  }

  function editBill<Key extends keyof Bill>(id: Bill['id'], field: Key, input: Bill[Key]): void {
    const billIndex: number = bills.value.findIndex((Bill: Bill) => Bill.id === id);
    if (billIndex === -1) return;
    bills.value[billIndex][field] = input;
  }

  function deleteBill(id: Bill['id']) {
    const billIndex: number = bills.value.findIndex((Bill: Bill) => Bill.id === id);
    if (billIndex === -1) return;
    bills.value.splice(billIndex, 1);
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
        return { ...acc, [bill.paidBy]: acc[bill.paidBy] + bill.cost };
      }
      return { ...acc, [bill.paidBy]: bill.cost };
    }, {});
  });

  const allDebtsByPersonId = computed(() => {
    const peopleStore = usePeopleStore();
    return peopleStore.people.reduce((acc: DebtStructures, person: Person) => {
      const debts = getDebtsByPersonId(person.id);
      if (Object.keys(debts).length) {
        return { ...acc, [person.id]: debts };
      }
      return acc;
    }, {});
  });

  function getDebtsByPersonId(personId: Person['id']) {
    const debtsObject = billsMonthly.value.reduce((acc: DebtStructure, bill: Bill) => {
      if (!bill.paidBy) return acc;
      if (!bill.belongsTo.length) return acc;
      if (bill.belongsTo.length === 1 && bill.belongsTo[0] === bill.paidBy) return acc;
      if (bill.paidBy !== personId && !bill.belongsTo.includes(personId)) return acc;

      const currentBillDebts = bill.belongsTo.reduce((billAcc, debtorId: Person['id']) => {
        if (bill.paidBy === debtorId) return billAcc;
        if (bill.paidBy === personId) {
          return { ...billAcc, [debtorId]: -getBillShare(bill, debtorId) };
        }
        return { ...billAcc, [bill.paidBy as string]: getBillShare(bill, debtorId) };
      }, {});

      return _mergeWith({}, acc, currentBillDebts, (objValue, srcValue) => {
        if (typeof objValue === 'number') {
          return objValue + srcValue;
        }
      });
    }, {});

    return Object.entries(debtsObject).reduce((acc, [creditorId, amount]) => {
      if (amount <= 0) return acc;
      return { ...acc, [creditorId]: amount };
    }, {});
  }

  function getBillShare(bill: Bill, personId: Person['id']) {
    const peopleStore = usePeopleStore();
    if (!bill.belongsTo.includes(personId)) return 0;

    if (splitType.value === SplitType.EQUAL) {
      return parseFloat((bill.cost / bill.belongsTo.length).toFixed(2));
    } else {
      const income = peopleStore.getPersonById(personId)?.income;
      const totalIncomesOfBillUsers = peopleStore.people.reduce((acc: number, person: Person) => {
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

  function $reset() {
    bills.value = [blankBill()];
    splitType.value = SplitType.EQUAL;
  }

  return {
    bills,
    addBill,
    editBill,
    deleteBill,
    billsMonthly,
    splitType,
    getBillShare,
    getDebtsByPersonId,
    $reset,
    totalOutgoings,
    allDebtsByPersonId,
  };
});
