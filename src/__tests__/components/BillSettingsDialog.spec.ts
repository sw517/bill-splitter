import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { type Bill, BillFrequency, SplitType } from '@/types/Bill';
import { CurrencyIcon } from '@/types/General';
import BillSettingsDialog from '@/components/bill-list/BillSettingsDialog.vue';
import { createVuetify } from 'vuetify';
const vuetify = createVuetify();

const defaultBill = ({
  id = 'bill-123',
  name = 'Rent',
  cost = 1000,
  frequency = BillFrequency.MONTHLY,
  belongsTo = [],
  paidBy = '',
  splitType = SplitType.EQUAL,
}: Partial<Bill> = {}): Bill => ({
  id,
  name,
  cost,
  frequency,
  belongsTo,
  paidBy,
  splitType,
});

const defaultPeople = () => [
  { id: '1', name: 'Bob', fallbackName: 'Person #1', income: 10000, defaultPayer: true },
  { id: '2', name: 'Jim', fallbackName: 'Person #2', income: 10000, defaultPayer: false },
];

const defaultProps = ({
  bill = defaultBill(),
  people = defaultPeople(),
  currencyIcon = CurrencyIcon.GBP,
  modelValue = true,
} = {}) => ({
  modelValue,
  bill,
  people,
  currencyIcon,
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

describe('BillSettingsDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders the bill description', () => {
      const wrapper = mount(BillSettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });

      expect(wrapper.find('[data-vitest="bill-settings-dialog-description"]').text()).toBe(
        defaultBill().name
      );
    });

    it('renders the bill cost', () => {
      const wrapper = mount(BillSettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      expect(wrapper.find('[data-vitest="bill-settings-dialog-cost"]').text()).toBe(
        String(defaultBill().cost)
      );
    });

    it('renders a frequency input', async () => {
      const wrapper = mount(BillSettingsDialog, {
        props: defaultProps(),
        global: defaultGlobal(),
      });

      expect(wrapper.find('[data-vitest="bill-settings-dialog-input-frequency"]').exists()).toBe(
        true
      );
    });

    it('renders the bill frequency in the input', async () => {
      const wrapper = mount(BillSettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });

      const frequencyInputWrapper = wrapper.find(
        '[data-vitest="bill-settings-dialog-input-frequency"]'
      );
      const frequencyInputElement = frequencyInputWrapper.find('input');
      expect((frequencyInputElement.element as HTMLInputElement).value).toBe(BillFrequency.MONTHLY);
    });
  });
});
