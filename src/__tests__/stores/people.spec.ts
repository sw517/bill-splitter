import { describe, it, expect, beforeEach, test } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { BillFrequency } from '@/types/Bill';

describe('Store: people', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('Creating a new person', () => {
    it('creates a new blank person', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({ people: [] });
      expect(peopleStore.people).toHaveLength(0);

      peopleStore.addPerson();
      expect(peopleStore.people).toHaveLength(1);
      expect(peopleStore.people[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '',
          income: 0,
        })
      );
    });

    it('creates two people during initialisation', () => {
      const peopleStore = usePeopleStore();
      expect(peopleStore.people).toHaveLength(2);
    });
  });

  it('returns an array of people', () => {
    const peopleStore = usePeopleStore();
    peopleStore.$patch({
      people: [{ id: 'id-123', name: 'Jim', income: 2000 }],
    });
    expect(peopleStore.people).toHaveLength(1);
  });

  it('returns a person by id', () => {
    const peopleStore = usePeopleStore();
    peopleStore.$patch({ people: [{ id: 'id-123', name: 'Jim', income: 2000 }] });
    expect(peopleStore.getPersonById('id-123')).toEqual(
      expect.objectContaining({
        id: 'id-123',
        name: 'Jim',
        income: 2000,
      })
    );
  });

  it('returns the default payer', () => {
    const peopleStore = usePeopleStore();
    peopleStore.$patch({
      defaultPayer: 'id-123',
      people: [{ id: 'id-123', name: 'Jim', income: 2000 }],
    });
    expect(peopleStore.defaultPayer).toEqual('id-123');
  });

  describe('Deleting a person', () => {
    it('deletes a person', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [{ id: 'id-123', name: 'Jim', income: 2000 }],
      });
      peopleStore.deletePerson('id-123');
      expect(peopleStore.people).toHaveLength(0);
    });

    it('removes the persons ID from all bills', () => {
      const peopleStore = usePeopleStore();
      const billsStore = useBillsStore();
      peopleStore.$patch({
        people: [{ id: 'person-1', name: 'Jim', income: 2000 }],
      });
      billsStore.$patch({
        bills: [
          {
            id: 'bill-1',
            name: 'Rent',
            cost: 1000,
            frequency: BillFrequency.MONTHLY,
            paidBy: 'person-1',
            belongsTo: ['person-1'],
          },
        ],
      });

      peopleStore.deletePerson('person-1');
      expect(billsStore.bills[0]).toEqual(
        expect.objectContaining({
          id: 'bill-1',
          name: 'Rent',
          cost: 1000,
          frequency: BillFrequency.MONTHLY,
          paidBy: undefined,
          belongsTo: [],
        })
      );
    });
  });

  describe('Updating a person', () => {
    it('updates a person', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [{ id: 'id-123', name: 'Robert', income: 2000 }],
      });
      peopleStore.editPerson('id-123', 'name', 'Bob');
      expect(peopleStore.people[0]).toEqual(
        expect.objectContaining({
          id: 'id-123',
          name: 'Bob',
          income: 2000,
        })
      );
    });
  });
});
