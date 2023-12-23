import { describe, it, expect, beforeEach, test } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
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
          splitType: SplitType.EQUAL,
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
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
            splitType: SplitType.EQUAL,
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
      billsStore.$patch({
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
            splitType: SplitType.RATIO,
          },
        ],
      });
      const bill = billsStore.bills[0];
      const person1 = peopleStore.people[0];
      const person2 = peopleStore.people[1];
      expect(billsStore.getBillShare(bill, person1.id)).toBe(600);
      expect(billsStore.getBillShare(bill, person2.id)).toBe(300);
    });

    test('when bill split is based on income ratio with only one debtor', () => {
      billsStore.$patch({
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1'],
            splitType: SplitType.RATIO,
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
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
            splitType: SplitType.EQUAL,
          },
          {
            id: '2',
            name: 'Pet Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '2',
            belongsTo: ['2', '3'],
            splitType: SplitType.EQUAL,
          },
          {
            id: '3',
            name: 'Phone Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '1',
            belongsTo: ['3'],
            splitType: SplitType.EQUAL,
          },
          {
            id: '4',
            name: 'Netflix',
            frequency: BillFrequency.MONTHLY,
            cost: 10,
            paidBy: '1',
            belongsTo: ['1'],
            splitType: SplitType.EQUAL,
          },
        ],
      });
    });

    test('when bill split is equal', () => {
      expect(billsStore.getDebtsByPersonId('2')).toEqual({
        '1': 450,
      });
      expect(billsStore.getDebtsByPersonId('3')).toEqual({
        '1': 100,
        '2': 50,
      });
    });

    test('when bill split is based on income ratio', () => {
      billsStore.$patch({
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
            splitType: SplitType.RATIO,
          },
          {
            id: '2',
            name: 'Pet Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '2',
            belongsTo: ['2', '3'],
            splitType: SplitType.RATIO,
          },
          {
            id: '3',
            name: 'Phone Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '1',
            belongsTo: ['3'],
            splitType: SplitType.RATIO,
          },
          {
            id: '4',
            name: 'Netflix',
            frequency: BillFrequency.MONTHLY,
            cost: 10,
            paidBy: '1',
            belongsTo: ['1'],
            splitType: SplitType.RATIO,
          },
        ],
      });
      expect(billsStore.getDebtsByPersonId('2')).toEqual({
        '1': 300,
      });
      expect(billsStore.getDebtsByPersonId('3')).toEqual({
        '1': 100,
        '2': 54.55,
      });
    });

    test('when bill splits are a mix of equal and ratio', () => {
      billsStore.$patch({
        bills: [
          {
            id: '1',
            name: 'Rent',
            frequency: BillFrequency.MONTHLY,
            cost: 900,
            paidBy: '1',
            belongsTo: ['1', '2'],
            splitType: SplitType.RATIO,
          },
          {
            id: '2',
            name: 'Pet Insurance',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '2',
            belongsTo: ['2', '3'],
            splitType: SplitType.EQUAL,
          },
          {
            id: '3',
            name: 'Internet',
            frequency: BillFrequency.MONTHLY,
            cost: 20,
            paidBy: '1',
            belongsTo: ['1', '3'],
            splitType: SplitType.RATIO,
          },
        ],
      });
      expect(billsStore.getDebtsByPersonId('2')).toEqual({
        '1': 300,
      });
      expect(billsStore.getDebtsByPersonId('3')).toEqual({
        '1': 7.5,
        '2': 50,
      });
    });

    test('debts can be cancelled out', () => {
      billsStore.$patch({
        bills: [
          {
            id: '1',
            name: 'Electric',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '1',
            belongsTo: ['1', '2'],
            splitType: SplitType.EQUAL,
          },
          {
            id: '2',
            name: 'Gas',
            frequency: BillFrequency.MONTHLY,
            cost: 100,
            paidBy: '2',
            belongsTo: ['1', '2'],
            splitType: SplitType.EQUAL,
          },
        ],
      });

      expect(billsStore.getDebtsByPersonId('1')).toEqual({});
      expect(billsStore.getDebtsByPersonId('2')).toEqual({});
    });

    test('it builds a structure of debts', () => {
      expect(billsStore.allDebtsByPersonId).toEqual({
        '2': {
          '1': 450,
        },
        '3': {
          '1': 100,
          '2': 50,
        },
      });
    });
  });

  it('resets the store', () => {
    const peopleStore = usePeopleStore();
    peopleStore.$patch({
      people: [
        {
          id: 'person-1',
          name: 'Jim',
          income: 2000,
        },
      ],
      defaultPayer: 'person-2',
    });

    const billsStore = useBillsStore();
    billsStore.$patch({
      bills: [
        {
          id: 'bill-3',
          name: 'Council Tax',
          cost: 200,
          paidBy: 'person-zyx',
          belongsTo: ['person-xyz', 'person-zyx'],
        },
      ],
      splitType: SplitType.RATIO,
    });

    billsStore.$reset();

    expect(billsStore.bills).toEqual([
      {
        id: expect.any(String),
        name: '',
        cost: 0,
        frequency: BillFrequency.MONTHLY,
        belongsTo: ['person-1'],
        paidBy: 'person-2',
        splitType: SplitType.RATIO,
      },
    ]);
    expect(billsStore.splitType).toBe(SplitType.EQUAL);
  });

  it('deletes a bill', () => {
    const billsStore = useBillsStore();
    billsStore.$patch({
      bills: [
        {
          id: 'bill-1',
          name: 'Rent',
          cost: 1000,
          frequency: BillFrequency.MONTHLY,
          belongsTo: [],
          paidBy: undefined,
        },
        {
          id: 'bill-2',
          name: 'Tax',
          cost: 100,
          frequency: BillFrequency.MONTHLY,
          belongsTo: [],
          paidBy: undefined,
        },
        {
          id: 'bill-3',
          name: 'Internet',
          cost: 10,
          frequency: BillFrequency.MONTHLY,
          belongsTo: [],
          paidBy: undefined,
        },
      ],
    });

    billsStore.deleteBill('bill-2');
    expect(billsStore.bills).toEqual(
      expect.arrayContaining([
        {
          id: 'bill-1',
          name: 'Rent',
          cost: 1000,
          frequency: BillFrequency.MONTHLY,
          belongsTo: [],
          paidBy: undefined,
        },
        {
          id: 'bill-3',
          name: 'Internet',
          cost: 10,
          frequency: BillFrequency.MONTHLY,
          belongsTo: [],
          paidBy: undefined,
        },
      ])
    );
  });
});
