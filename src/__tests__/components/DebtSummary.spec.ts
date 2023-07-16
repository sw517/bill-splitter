import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import DebtSummary from '@/components/DebtSummary.vue';
import { createVuetify } from 'vuetify';

const vuetify = createVuetify();

const defaultGlobal = () => ({
  plugins: [vuetify],
});

describe('DebtSummary', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders a VCard', () => {
      const wrapper = mount(DebtSummary, {
        global: defaultGlobal(),
      });
      expect(wrapper.findComponent({ name: 'VCard' }).exists()).toBe(true);
    });
  });
});
