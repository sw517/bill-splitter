import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import PersonListItem from '@/components/PersonListItem.vue';
import { createVuetify } from 'vuetify';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { BillFrequency } from '@/types/Bill';
const vuetify = createVuetify();

const defaultPerson = ({
  id = 'person-1',
  name = 'Jim',
  income = 2000,
  fallbackName = 'Person #1',
  ...args
} = {}) => ({
  id,
  name,
  income,
  fallbackName,
  ...args,
});

const defaultProps = ({ person = defaultPerson(), index = 2, ...args } = {}) => ({
  person,
  index,
  ...args,
});

const defaultGlobal = () => ({
  plugins: [vuetify],
  stubs: {
    'v-dialog': {
      template: '<div v-if="modelValue"><slot></slot></div>',
      props: ['modelValue'],
    },
  },
});

describe('PersonListItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a name input', () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-input-name"]').exists()).toBe(true);
    });

    it("renders the person's name in the input", () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      const nameInputWrapper = wrapper.findComponent('[data-vitest="person-list-item-input-name"]');
      const nameInputElement = nameInputWrapper.find('input');
      expect((nameInputElement.element as HTMLInputElement).value).toBe('Jim');
    });

    it('renders an income input', () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-input-income"]').exists()).toBe(true);
    });

    it("renders the person's income in the input", () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      const incomeInputWrapper = wrapper.findComponent(
        '[data-vitest="person-list-item-input-income"]'
      );
      const incomeInputElement = incomeInputWrapper.find('input');
      expect((incomeInputElement.element as HTMLInputElement).value).toBe('2000');
    });

    it('renders a delete button', () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-button-delete"]').exists()).toBe(true);
    });
  });

  describe('Deleting a person', () => {
    it('opens a confirmation dialog when the delete button is clicked', async () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-dialog-delete"]').exists()).toBe(false);
      const deleteButtonWrapper = wrapper.findComponent(
        '[data-vitest="person-list-item-button-delete"]'
      );
      await deleteButtonWrapper.trigger('click');
      expect(wrapper.find('[data-vitest="person-list-item-dialog-delete"]').exists()).toBe(true);
    });

    it("deletes a person when the dialog's delete button is clicked", async () => {
      const personToRemove = defaultPerson({ id: 'person-2' });
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [
          defaultPerson({ id: 'person-1' }),
          personToRemove,
          defaultPerson({ id: 'person-3' }),
        ],
      });
      expect(peopleStore.people).toHaveLength(3);

      const wrapper = mount(PersonListItem, {
        props: defaultProps({ person: personToRemove }),
        global: defaultGlobal(),
      });
      wrapper.vm.showDeleteDialog = true;
      await wrapper.vm.$nextTick();
      const confirmDeleteButtonWrapper = wrapper.findComponent(
        '[data-vitest="person-list-item-button-confirm-delete"]'
      );
      await confirmDeleteButtonWrapper.trigger('click');
      expect(peopleStore.people).toHaveLength(2);
    });

    it('removes the persons ID from all bills', async () => {
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

      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      wrapper.vm.showDeleteDialog = true;
      await wrapper.vm.$nextTick();
      const confirmDeleteButtonWrapper = wrapper.findComponent(
        '[data-vitest="person-list-item-button-confirm-delete"]'
      );
      await confirmDeleteButtonWrapper.trigger('click');

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
});
