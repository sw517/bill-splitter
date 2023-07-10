import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';

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

    it('creates two people during initialisation if data is not loaded from storage', () => {
      const peopleStore = usePeopleStore();
      expect(peopleStore.people).toHaveLength(2);
      expect(peopleStore.people[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '',
          income: 0,
        })
      );
      expect(peopleStore.people[1]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: '',
          income: 0,
        })
      );
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

    it('sets a new defaultPayer if the deleted person was the defaultPayer and there is at least one person', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        defaultPayer: 'person-2',
        people: [
          { id: 'person-1', name: 'Jim', income: 2000 },
          { id: 'person-2', name: 'Bob', income: 2000 },
          { id: 'person-3', name: 'Bob', income: 2000 },
        ],
      });
      peopleStore.deletePerson('person-2');
      expect(peopleStore.defaultPayer).toEqual('person-1');
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
