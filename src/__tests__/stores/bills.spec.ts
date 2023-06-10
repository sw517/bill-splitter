import { describe, it, expect, beforeEach, test } from 'vitest';
import { setActivePinia, createPinia, storeToRefs } from 'pinia';
import { useBillsStore } from '@/stores/bills';
import { BillFrequency, SplitType } from '@/types/Bill';
import { usePeopleStore } from '@/stores/people';

describe('Store: bills', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('returns an array of bills', () => {
    const billsStore = useBillsStore();
    expect(billsStore.bills).toHaveLength(1);
  });

  describe('Creating a new bill', () => {
    it('creates a new blank bill', () => {
      const billsStore = useBillsStore();
      expect(billsStore.bills).toHaveLength(1);
      billsStore.addBill();
      expect(billsStore.bills).toHaveLength(2);
      expect(billsStore.bills[1]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '',
          cost: 0,
          frequency: BillFrequency.MONTHLY,
          belongsTo: expect.any(Array),
          paidBy: expect.any(String),
        })
      );
    });

    it('assigns all people to belongsTo by default', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [
          {
            id: 'id-112',
            name: 'Jim',
            income: 2000,
          },
          {
            id: 'id-334',
            name: 'Ann',
            income: 1000,
          },
        ],
      });

      const billsStore = useBillsStore();
      expect(billsStore.bills).toHaveLength(1);
      billsStore.addBill();
      expect(billsStore.bills).toHaveLength(2);
      expect(billsStore.bills[1]).toEqual(
        expect.objectContaining({
          belongsTo: ['id-112', 'id-334'],
        })
      );
    });

    it('assigns the default bill payer to paidTo', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        defaultPayer: 'id-101',
      });

      const billsStore = useBillsStore();
      expect(billsStore.bills).toHaveLength(1);
      billsStore.addBill();
      expect(billsStore.bills).toHaveLength(2);
      expect(billsStore.bills[1]).toEqual(
        expect.objectContaining({
          paidBy: 'id-101',
        })
      );
    });
  });

  it('edits a bill', () => {
    const billsStore = useBillsStore();
    expect(billsStore.bills).toHaveLength(1);
    expect(billsStore.bills[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: '',
        cost: 0,
      })
    );
    const billId = billsStore.bills[0].id;
    billsStore.editBill(billId, 'name', 'Rent');
    billsStore.editBill(billId, 'cost', 3000);
    expect(billsStore.bills[0].name).toBe('Rent');
    expect(billsStore.bills[0].cost).toBe(3000);
  });

  it('returns an array of bills calculated at monthly costs', () => {
    const billsStore = useBillsStore();
    billsStore.$patch({
      bills: [
        {
          id: '1',
          name: 'Rent',
          cost: 1000,
          frequency: BillFrequency.MONTHLY,
          belongsTo: [],
          paidBy: undefined,
        },
        {
          id: '2',
          name: 'Contents Insurance',
          cost: 120,
          frequency: BillFrequency.YEARLY,
          belongsTo: [],
          paidBy: undefined,
        },
      ],
    });
    expect(billsStore.billsMonthly).toEqual([
      {
        id: '1',
        name: 'Rent',
        cost: 1000,
        frequency: BillFrequency.MONTHLY,
        belongsTo: [],
        paidBy: undefined,
      },
      {
        id: '2',
        name: 'Contents Insurance',
        cost: 10,
        frequency: BillFrequency.MONTHLY,
        belongsTo: [],
        paidBy: undefined,
      },
    ]);
  });

  it('returns the split type', () => {
    const billsStore = useBillsStore();
    expect(billsStore.splitType).toBe(SplitType.EQUAL);
  });

  describe('Calculating a persons share of a bill', () => {
    let billsStore: any, peopleStore: any;
    beforeEach(() => {
      billsStore = useBillsStore();
      peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [
          {
            id: '1',
            name: 'Jim',
            income: 2000,
          },
          {
            id: '2',
            name: 'Ann',
            income: 1000,
          },
          {
            id: '3',
            name: 'Roberto',
            income: 1200,
          },
        ],
      });
      billsStore.$patch({
        splitType: SplitType.EQUAL,
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
          },
        ],
      });
    });

    test('when bill split is equal', () => {
      const bill = billsStore.bills[0];
      const person1 = peopleStore.people[0];
      const person2 = peopleStore.people[1];
      expect(billsStore.getBillShare(bill, person1.id)).toBe(450);
      expect(billsStore.getBillShare(bill, person2.id)).toBe(450);
    });

    test('when bill split is based on income ratio', () => {
      billsStore.splitType = SplitType.RATIO;
      const bill = billsStore.bills[0];
      const person1 = peopleStore.people[0];
      const person2 = peopleStore.people[1];
      expect(billsStore.getBillShare(bill, person1.id)).toBe(600);
      expect(billsStore.getBillShare(bill, person2.id)).toBe(300);
    });

    test('when bill split is based on income ratio with only one debtor', () => {
      billsStore.splitType = SplitType.RATIO;
      billsStore.$patch({
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1'],
          },
        ],
      });
      const bill = billsStore.bills[0];
      const person1 = peopleStore.people[0];
      const person2 = peopleStore.people[1];
      expect(billsStore.getBillShare(bill, person1.id)).toBe(900);
      expect(billsStore.getBillShare(bill, person2.id)).toBe(0);
    });
  });

  describe('Calculating total outgoings', () => {
    let billsStore: any, peopleStore: any;
    beforeEach(() => {
      billsStore = useBillsStore();
      peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [
          {
            id: '1',
            name: 'Jim',
            income: 2000,
          },
          {
            id: '2',
            name: 'Ann',
            income: 1000,
          },
          {
            id: '3',
            name: 'Roberto',
            income: 1200,
          },
        ],
      });
      billsStore.$patch({
        splitType: SplitType.EQUAL,
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
          },
        ],
      });
    });

    test('when one person pays a bill', () => {
      expect(billsStore.totalOutgoings).toEqual({
        [peopleStore.people[0].id]: 900,
      });
    });

    test('when multiple people pay multiple bills', () => {
      billsStore.$patch({
        splitType: SplitType.EQUAL,
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
          },
          {
            id: '2',
            name: 'Pet Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '2',
            belongsTo: ['1', '2'],
          },
          {
            id: '3',
            name: 'House Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 200,
            paidBy: '2',
            belongsTo: ['1', '2'],
          },
        ],
      });
      expect(billsStore.totalOutgoings).toEqual({
        [peopleStore.people[0].id]: 900,
        [peopleStore.people[1].id]: 300,
      });
    });
  });

  describe('Calculating debts to bill payers', () => {
    let billsStore: any, peopleStore: any;
    beforeEach(() => {
      billsStore = useBillsStore();
      peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [
          {
            id: '1',
            name: 'Jim',
            income: 2000,
          },
          {
            id: '2',
            name: 'Ann',
            income: 1000,
          },
          {
            id: '3',
            name: 'Roberto',
            income: 1200,
          },
        ],
      });
      billsStore.$patch({
        splitType: SplitType.EQUAL,
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
          },
          {
            id: '2',
            name: 'Pet Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '2',
            belongsTo: ['2', '3'],
          },
          {
            id: '3',
            name: 'Phone Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '1',
            belongsTo: ['3'],
          },
          {
            id: '4',
            name: 'Netflix',
            frequency: BillFrequency.MONTHLY,
            cost: 10,
            paidBy: '1',
            belongsTo: ['1'],
          },
        ],
      });
    });

    test('when bill split is equal', () => {
      expect(billsStore.debtsByPersonId).toEqual({
        [peopleStore.people[1].id]: {
          [peopleStore.people[0].id]: 450,
        },
        [peopleStore.people[2].id]: {
          [peopleStore.people[0].id]: 100,
          [peopleStore.people[1].id]: 50,
        },
      });
    });
  });
});
