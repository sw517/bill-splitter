import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { useGeneralStore } from '@/stores/general';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import App from '@/App.vue';
import { Currency } from '@/types/General';
import { SplitType } from '@/types/Bill';

const vuetify = createVuetify();

class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverStub;

const defaultGlobal = () => ({
  plugins: [vuetify],
});

describe('PersonList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a VApp', () => {
      const wrapper = mount(App, {
        global: defaultGlobal(),
      });
      expect(wrapper.findComponent({ name: 'VApp' }).exists()).toBe(true);
    });
  });

  describe('Loading from localStorage', () => {
    it('loads generalStore state from localStorage', () => {
      const generalStore = useGeneralStore();
      generalStore.$patch({ currency: Currency.USD, autosave: true });

      localStorage.setItem(
        'general',
        JSON.stringify({
          currency: Currency.EURO,
          autosave: false,
        })
      );

      const wrapper = mount(App, {
        global: defaultGlobal(),
      });
      wrapper.vm.loadFromLocalStorage();
      expect(generalStore.currency).toEqual(Currency.EURO);
      expect(generalStore.autosave).toEqual(false);
    });

    it('loads peopleStore state from localStorage', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [{ id: 'person-2', name: 'Jim', income: 2000 }],
        defaultPayer: 'person-2',
      });

      localStorage.setItem(
        'people',
        JSON.stringify({
          people: [{ id: 'person-5', name: 'Bob', income: 1000 }],
          defaultPayer: 'person-5',
        })
      );

      const wrapper = mount(App, {
        global: defaultGlobal(),
      });
      wrapper.vm.loadFromLocalStorage();
      expect(peopleStore.people[0].id).toEqual('person-5');
      expect(peopleStore.people[0].name).toEqual('Bob');
      expect(peopleStore.people[0].income).toEqual(1000);
      expect(peopleStore.defaultPayer).toEqual('person-5');
    });

    it('loads billsStore state from localStorage', () => {
      const billsStore = useBillsStore();
      billsStore.$patch({
        bills: [
          {
            id: 'bill-1',
            name: 'Rent',
            cost: 1000,
            paidBy: 'person-1',
            belongsTo: ['person-1', 'person-2'],
          },
        ],
      });

      localStorage.setItem(
        'bills',
        JSON.stringify({
          bills: [
            {
              id: 'bill-3',
              name: 'Council Tax',
              cost: 200,
              paidBy: 'person-2',
              belongsTo: ['person-1', 'person-2'],
            },
          ],
        })
      );

      const wrapper = mount(App, {
        global: defaultGlobal(),
      });
      wrapper.vm.loadFromLocalStorage();
      expect(billsStore.bills[0].id).toEqual('bill-3');
      expect(billsStore.bills[0].name).toEqual('Council Tax');
      expect(billsStore.bills[0].cost).toEqual(200);
      expect(billsStore.bills[0].paidBy).toEqual('person-2');
      expect(billsStore.bills[0].belongsTo).toEqual(['person-1', 'person-2']);
    });
  });

  describe('Saving to localStorage with autosave', () => {
    it('watches generalStore state and saves to localStorage', async () => {
      const generalStore = useGeneralStore();
      mount(App, { global: defaultGlobal() });
      generalStore.$patch({ currency: Currency.USD, autosave: true });

      const localStoredState = localStorage.getItem('general');
      expect(localStoredState && JSON.parse(localStoredState)).toEqual(
        expect.objectContaining({ currency: Currency.USD, autosave: true })
      );

      generalStore.$patch({ currency: Currency.EURO });
      const updatedLocalStoredState = localStorage.getItem('general');
      expect(updatedLocalStoredState && JSON.parse(updatedLocalStoredState)).toEqual(
        expect.objectContaining({ currency: Currency.EURO })
      );
    });

    it('watches peopleStore state and saves to localStorage', async () => {
      const generalStore = useGeneralStore();
      const peopleStore = usePeopleStore();
      mount(App, { global: defaultGlobal() });
      generalStore.$patch({ autosave: true });
      peopleStore.$patch({ defaultPayer: 'person-xyz' });

      const localStoredState = localStorage.getItem('people');
      expect(localStoredState && JSON.parse(localStoredState)).toEqual(
        expect.objectContaining({ defaultPayer: 'person-xyz' })
      );

      peopleStore.$patch({ defaultPayer: 'person-abc' });
      const updatedLocalStoredState = localStorage.getItem('people');
      expect(updatedLocalStoredState && JSON.parse(updatedLocalStoredState)).toEqual(
        expect.objectContaining({ defaultPayer: 'person-abc' })
      );
    });

    it('watches billsStore state and saves to localStorage', async () => {
      const generalStore = useGeneralStore();
      const billsStore = useBillsStore();
      mount(App, { global: defaultGlobal() });
      generalStore.$patch({ autosave: true });
      billsStore.$patch({ splitType: SplitType.EQUAL });

      const localStoredState = localStorage.getItem('bills');
      expect(localStoredState && JSON.parse(localStoredState)).toEqual(
        expect.objectContaining({ splitType: SplitType.EQUAL })
      );

      billsStore.$patch({ splitType: SplitType.RATIO });
      const updatedLocalStoredState = localStorage.getItem('bills');
      expect(updatedLocalStoredState && JSON.parse(updatedLocalStoredState)).toEqual(
        expect.objectContaining({ splitType: SplitType.RATIO })
      );
    });
  });

  describe('Saving to localStorage without autosave', () => {
    it('manually saves all states to localStorage', async () => {
      const generalStore = useGeneralStore();
      const peopleStore = usePeopleStore();
      const billsStore = useBillsStore();
      const wrapper = mount(App, { global: defaultGlobal() });
      generalStore.$patch({ autosave: false });
      peopleStore.$patch({ defaultPayer: 'person-xyz' });
      billsStore.$patch({ splitType: SplitType.EQUAL });

      wrapper.vm.saveToLocalStorage();
      peopleStore.$patch({ defaultPayer: 'person-qwerty' });

      const localStoredPeopleState = localStorage.getItem('people');
      expect(localStoredPeopleState && JSON.parse(localStoredPeopleState)).toEqual(
        expect.objectContaining({ defaultPayer: 'person-xyz' })
      );

      wrapper.vm.saveToLocalStorage();
      const updatedLocalPeople = localStorage.getItem('people');
      expect(updatedLocalPeople && JSON.parse(updatedLocalPeople)).toEqual(
        expect.objectContaining({ defaultPayer: 'person-qwerty' })
      );
    });
  });
});
