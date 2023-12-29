import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import SettingsDialog from '@/components/dialogs/SettingsDialog.vue';
import { createVuetify } from 'vuetify';
import { useGeneralStore } from '@/stores/general';
import { useBillsStore } from '@/stores/bills';
import { BillFrequency, SplitType } from '@/types/Bill';
const vuetify = createVuetify();

const defaultGlobal = (args = {}) => ({
  plugins: [vuetify],
  stubs: {
    'v-dialog': {
      template: '<div v-if="modelValue"><slot></slot></div>',
      props: ['modelValue'],
    },
  },
  ...args,
});

const defaultProps = ({ modelValue = true } = {}) => ({
  modelValue,
});

describe('SettingsDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a VDialog', () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });
      expect(wrapper.findComponent({ name: 'VDialog' }).exists()).toBe(true);
    });

    it('renders a VCard', () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(true);
    });
  });

  describe('Saving data', () => {
    it('renders a VSwitch for autosave', () => {
      const generalStore = useGeneralStore();
      generalStore.$patch({ autosave: true });

      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      const autosaveToggle = wrapper.findComponent({ name: 'VSwitch' });
      expect(autosaveToggle.exists()).toBe(true);
      expect(autosaveToggle.attributes('data-vitest')).toBe('settings-toggle-autosave');
      expect(autosaveToggle.find('input').attributes('value')).toBe('true');
    });

    it('renders a VBtn for clearing data', () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      const clearButton = wrapper.find('[data-vitest="settings-button-clear"]');
      expect(clearButton.exists()).toBe(true);
    });
  });

  describe('Copying data', () => {
    it('renders a button to copy data as json', () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      const clearButton = wrapper.find('[data-vitest="settings-button-copy-data"]');
      expect(clearButton.exists()).toBe(true);
    });

    it('copies a stringified JSON to clipboard on button click', async () => {
      const writeText = vi.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText,
        },
      });

      const generalStoreData = { autosave: true };
      const billsStoreData = {
        splitType: SplitType.EQUAL,
        bills: [
          {
            id: '1',
            cost: 10,
            name: 'Internet',
            frequency: BillFrequency.MONTHLY,
            belongsTo: '1',
            paidBy: '1',
            splitType: SplitType.EQUAL,
          },
        ],
      };
      const peopleStoreData = {
        people: [{ id: '1', name: 'Bob', fallbackName: 'Person #1', income: 10000 }],
      };
      localStorage.setItem('general', JSON.stringify(generalStoreData));
      localStorage.setItem('bills', JSON.stringify(billsStoreData));
      localStorage.setItem('people', JSON.stringify(peopleStoreData));

      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      await wrapper.find('[data-vitest="settings-button-copy-data"]').trigger('click');

      const expectedStringifiedData = JSON.stringify({
        general: generalStoreData,
        bills: billsStoreData,
        people: peopleStoreData,
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedStringifiedData);
    });
  });

  describe('Loading data', () => {
    it('renders a button to change to the "load data" view', () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      const clearButton = wrapper.find('[data-vitest="settings-button-load-data-view"]');
      expect(clearButton.exists()).toBe(true);
    });

    it('it renders the textarea in the loading view on button click', async () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      await wrapper.find('[data-vitest="settings-button-load-data-view"]').trigger('click');
      expect(wrapper.find('[data-vitest="settings-input-load-data"]').exists()).toBe(true);
    });

    it('renders a back button in the loading view', async () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      await wrapper.find('[data-vitest="settings-button-load-data-view"]').trigger('click');
      expect(wrapper.find('[data-vitest="settings-button-back"]').exists()).toBe(true);
    });

    it('hides the textarea on back click', async () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      await wrapper.find('[data-vitest="settings-button-load-data-view"]').trigger('click');
      expect(wrapper.find('[data-vitest="settings-input-load-data"]').exists()).toBe(true);

      await wrapper.find('[data-vitest="settings-button-back"]').trigger('click');
      expect(wrapper.find('[data-vitest="settings-input-load-data"]').exists()).toBe(false);
    });

    it('renders a paste button in the loading view', async () => {
      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      await wrapper.find('[data-vitest="settings-button-load-data-view"]').trigger('click');
      expect(wrapper.find('[data-vitest="settings-button-paste"]').exists()).toBe(true);
    });

    it('pastes text into the textarea on paste click', async () => {
      const readText = vi.fn().mockReturnValue('This should be pasted');
      Object.assign(navigator, {
        clipboard: {
          readText,
        },
      });

      const wrapper = mount(SettingsDialog, {
        global: defaultGlobal(),
        props: defaultProps(),
      });
      await wrapper.find('[data-vitest="settings-button-load-data-view"]').trigger('click');
      await wrapper.find('[data-vitest="settings-button-paste"]').trigger('click');

      const textFieldInput = wrapper
        .find('[data-vitest="settings-input-load-data"]')
        .find('textarea');
      expect((textFieldInput.element as HTMLTextAreaElement).value).toBe('This should be pasted');
    });
  });
});
