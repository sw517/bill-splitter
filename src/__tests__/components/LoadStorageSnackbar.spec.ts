import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import LoadStorageSnackbar from '@/components/snackbars/LoadStorage.vue';
import { createVuetify } from 'vuetify';
const vuetify = createVuetify();

const defaultGlobal = (args = {}) => ({
  plugins: [vuetify],
  ...args,
});

const defaultProps = ({ modelValue = true } = {}) => ({
  modelValue,
});

describe('LoadStorageSnackbar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a VSnackbar', () => {
      const wrapper = mount(LoadStorageSnackbar, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });
      expect(wrapper.findComponent({ name: 'VSnackbar' }).exists()).toBe(true);
    });

    it('renders a clear storage button', () => {
      const wrapper = mount(LoadStorageSnackbar, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });
      expect(
        wrapper.findComponent('[data-vitest="load-storage-snackbar-button-clear"]').exists()
      ).toBe(true);
    });
  });

  describe('Events', () => {
    it('emits "clear-storage-clicked" when the clear storage button is clicked', async () => {
      const wrapper = mount(LoadStorageSnackbar, {
        global: defaultGlobal({ stubs: null }),
        props: defaultProps(),
      });

      await wrapper
        .findComponent('[data-vitest="load-storage-snackbar-button-clear"]')
        .trigger('click');
      expect(wrapper.emitted('clear-storage-clicked')).toHaveLength(1);
    });
  });
});
