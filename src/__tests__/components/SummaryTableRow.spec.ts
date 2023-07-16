import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import SummaryTableRow from '@/components/SummaryTableRow.vue';
import { createVuetify } from 'vuetify';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { BillFrequency, SplitType } from '@/types/Bill';
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

const defaultGlobal = () => ({
  plugins: [vuetify],
});

const defaultProps = ({ person = defaultPerson(), ...args } = {}) => ({
  person,
  ...args,
});

describe('SummaryTableRow', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders an tr element', () => {
      const wrapper = mount(SummaryTableRow, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      expect(wrapper.find('tr').exists()).toBe(true);
    });

    it('renders a td element with the person name', () => {
      const wrapper = mount(SummaryTableRow, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      expect(wrapper.find('td:first-child').text()).toBe('Jim');
    });

    it('renders a td element with the total outgoings', async () => {
      const person = defaultPerson();
      const person2 = defaultPerson({
        id: 'person-2',
        name: 'Bob',
        income: 2000,
        fallbackName: 'Person #2',
      });

      const wrapper = mount(SummaryTableRow, {
        global: defaultGlobal(),
        props: defaultProps({ person }),
      });

      const peopleStore = usePeopleStore();
      const billsStore = useBillsStore();

      peopleStore.$patch({
        people: [person, person2],
      });
      billsStore.$patch({
        bills: [
          {
            id: 'bill-1',
            name: 'Rent',
            cost: 1000,
            paidBy: person.id,
            belongsTo: [person.id, person2.id],
            frequency: BillFrequency.MONTHLY,
          },
          {
            id: 'bill-2',
            name: 'Tax',
            cost: 150,
            paidBy: person.id,
            belongsTo: [person.id],
            frequency: BillFrequency.MONTHLY,
          },
          {
            id: 'bill-3',
            name: 'Internet',
            cost: 150,
            paidBy: person2.id,
            belongsTo: [person2.id],
            frequency: BillFrequency.MONTHLY,
          },
        ],
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('td:nth-child(2)').text()).toBe('1150');
    });

    it('renders a td element with the total owed', async () => {
      const person = defaultPerson();
      const person2 = defaultPerson({
        id: 'person-2',
        name: 'Bob',
        income: 2000,
        fallbackName: 'Person #2',
      });

      const wrapper = mount(SummaryTableRow, {
        global: defaultGlobal(),
        props: defaultProps({ person }),
      });

      const peopleStore = usePeopleStore();
      const billsStore = useBillsStore();

      peopleStore.$patch({
        people: [person, person2],
      });
      billsStore.$patch({
        splitType: SplitType.EQUAL,
        bills: [
          {
            id: 'bill-1',
            name: 'Rent',
            cost: 1000,
            paidBy: person.id,
            belongsTo: [person.id, person2.id],
            frequency: BillFrequency.MONTHLY,
          },
          {
            id: 'bill-2',
            name: 'Tax',
            cost: 150,
            paidBy: person.id,
            belongsTo: [person.id],
            frequency: BillFrequency.MONTHLY,
          },
          {
            id: 'bill-3',
            name: 'Internet',
            cost: 150,
            paidBy: person2.id,
            belongsTo: [person2.id],
            frequency: BillFrequency.MONTHLY,
          },
        ],
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find('td:nth-child(3)').text()).toBe('500');
    });
  });
});
