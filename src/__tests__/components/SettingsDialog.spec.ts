import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import SettingsDialog from '@/components/SettingsDialog.vue';
import { createVuetify } from 'vuetify';
import { useGeneralStore } from '@/stores/general';
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
});
