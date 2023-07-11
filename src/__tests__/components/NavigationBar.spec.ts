import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { VApp } from 'vuetify/components';
import NavigationBar from '@/components/NavigationBar.vue';
import { createVuetify } from 'vuetify';
const vuetify = createVuetify();

const defaultSlots = () => ({
  default: h(NavigationBar, { 'scroll-target': '' }),
});

const defaultGlobal = () => ({
  plugins: [vuetify],
});

class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverStub;

describe('NavigationBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // All mount() calls should mount the VApp and pass the NavigationBar
  // in the default slot due to the VAppBar breaking without the VApp.
  describe('DOM Rendering', () => {
    it('renders a VAppBar', () => {
      const wrapper = mount(VApp, {
        global: defaultGlobal(),
        slots: defaultSlots(),
      });
      expect(wrapper.findComponent({ name: 'VAppBar' }).exists()).toBe(true);
    });

    it('renders a VAppBarNavIcon', () => {
      const wrapper = mount(VApp, {
        global: defaultGlobal(),
        slots: defaultSlots(),
      });
      const appBarNavIcon = wrapper.findComponent({ name: 'VAppBarNavIcon' });
      expect(appBarNavIcon.exists()).toBe(true);
      expect(appBarNavIcon.attributes('data-vitest')).toBe('navigation-bar-button');
    });
  });

  describe('Events', () => {
    it('emits "settings-clicked" when the VAppBarNavIcon is clicked', async () => {
      const wrapper = mount(VApp, {
        global: defaultGlobal(),
        slots: defaultSlots(),
      });
      await wrapper.findComponent({ name: 'VAppBarNavIcon' }).trigger('click');
      expect(
        wrapper.findComponent({ name: 'NavigationBar' }).emitted('settings-clicked')
      ).toHaveLength(1);
    });
  });
});
