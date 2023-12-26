import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { type Bill, BillFrequency, SplitType } from '@/types/Bill';
import { CurrencyIcon } from '@/types/General';
import BillListItem from '@/components/BillListItem.vue';
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
  index = 2,
  people = defaultPeople(),
  currencyIcon = CurrencyIcon.GBP,
  descriptionAutocompleteItems = ['Rent', 'Home Insurance', 'Electricy'],
} = {}) => ({
  bill,
  index,
  people,
  currencyIcon,
  descriptionAutocompleteItems,
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

describe('BillListItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a description input', () => {
      const wrapper = mount(BillListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="bill-list-item-input-description"]').exists()).toBe(true);
    });

    it('renders the bill description in the input', () => {
      const wrapper = mount(BillListItem, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      const descriptionInputWrapper = wrapper.findComponent(
        '[data-vitest="bill-list-item-input-description"]'
      );
      const descriptionInputElement = descriptionInputWrapper.find('input');
      expect((descriptionInputElement.element as HTMLInputElement).value).toBe('Rent');
    });

    it('renders a cost input', () => {
      const wrapper = mount(BillListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="bill-list-item-input-cost"]').exists()).toBe(true);
    });

    it('renders the bill cost in the input', () => {
      const wrapper = mount(BillListItem, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      const costInputWrapper = wrapper.findComponent('[data-vitest="bill-list-item-input-cost"]');
      const costInputElement = costInputWrapper.find('input');
      expect((costInputElement.element as HTMLInputElement).value).toBe('1000');
    });

    it('opens a confirmation dialog when the delete button is clicked', async () => {
      const wrapper = mount(BillListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="bill-list-item-dialog"]').exists()).toBe(false);
      const configureButtonWrapper = wrapper.findComponent(
        '[data-vitest="bill-list-item-button-configure"]'
      );
      await configureButtonWrapper.trigger('click');
      expect(wrapper.find('[data-vitest="bill-list-item-dialog"]').exists()).toBe(true);
    });

    it('renders a frequency input', async () => {
      const wrapper = mount(BillListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      wrapper.vm.showConfigureDialog = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[data-vitest="bill-list-item-input-frequency"]').exists()).toBe(true);
    });

    it('renders the bill frequency in the input', async () => {
      const wrapper = mount(BillListItem, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      wrapper.vm.showConfigureDialog = true;
      await wrapper.vm.$nextTick();

      const frequencyInputWrapper = wrapper.findComponent(
        '[data-vitest="bill-list-item-input-frequency"]'
      );
      const frequencyInputElement = frequencyInputWrapper.find('input');
      expect((frequencyInputElement.element as HTMLInputElement).value).toBe(BillFrequency.MONTHLY);
    });

    it('renders an error icon if a bill is incomplete', async () => {
      const wrapper = mount(BillListItem, {
        global: defaultGlobal(),
        props: defaultProps({
          bill: defaultBill(),
        }),
      });
      expect(wrapper.find('[data-vitest="bill-list-item-icon-error"]').exists()).toBe(true);
      await wrapper.setProps({ bill: defaultBill({ paidBy: 'anyone', belongsTo: ['anyone'] }) });
      expect(wrapper.find('[data-vitest="bill-list-item-icon-error"]').exists()).toBe(false);
    });
  });
});
