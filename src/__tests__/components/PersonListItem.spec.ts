import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { CurrencyIcon } from '@/types/General';
import PersonListItem from '@/components/person-list/PersonListItem.vue';
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

const defaultProps = ({
  person = defaultPerson(),
  index = 2,
  currencyIcon = CurrencyIcon.GBP,
  ...args
} = {}) => ({
  person,
  index,
  currencyIcon,
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

    it('renders a settings button', () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-button-settings"]').exists()).toBe(true);
    });
  });
});
