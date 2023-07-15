import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import UseStorageSnackbar from '@/components/UseStorageSnackbar.vue';
import { createVuetify } from 'vuetify';
const vuetify = createVuetify();

const defaultGlobal = (args = {}) => ({
  plugins: [vuetify],
  ...args,
});

const defaultProps = ({ modelValue = true } = {}) => ({
  modelValue,
});

describe('UseStorageSnackbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a VSnackbar', () => {
      const wrapper = mount(UseStorageSnackbar, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });
      expect(wrapper.findComponent({ name: 'VSnackbar' }).exists()).toBe(true);
    });

    it('renders an enable autosave button', () => {
      const wrapper = mount(UseStorageSnackbar, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });
      expect(
        wrapper.findComponent('[data-vitest="use-storage-snackbar-button-enable"]').exists()
      ).toBe(true);
    });
  });

  describe('Events', () => {
    it('emits "enable-autosave-clicked" when the enable button is clicked', async () => {
      const wrapper = mount(UseStorageSnackbar, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });

      await wrapper
        .findComponent('[data-vitest="use-storage-snackbar-button-enable"]')
        .trigger('click');
      expect(wrapper.emitted('enable-autosave-clicked')).toHaveLength(1);
    });
  });
});
