import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import SplitTypeToggle from '@/components/SplitTypeToggle.vue';
import { createVuetify } from 'vuetify';
import { useBillsStore } from '@/stores/bills';
import { SplitType } from '@/types/Bill';

const vuetify = createVuetify();

const defaultGlobal = () => ({
  plugins: [vuetify],
});

describe('SplitTypeToggle', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders VSwitch', () => {
      const wrapper = mount(SplitTypeToggle, {
        global: defaultGlobal(),
      });
      expect(wrapper.findComponent({ name: 'VSwitch' }).exists()).toBe(true);
    });
  });

  describe('Events', () => {
    it('updates the split type in the store when clicked', async () => {
      const billsStore = useBillsStore();

      const wrapper = mount(SplitTypeToggle, {
        global: defaultGlobal(),
      });

      billsStore.$patch({ splitType: SplitType.EQUAL });

      await wrapper
        .findComponent({ name: 'VSwitch' })
        .vm.$emit('update:model-value', SplitType.RATIO);
      await wrapper.vm.$nextTick();
      expect(billsStore.splitType).toBe(SplitType.RATIO);
    });
  });
});
