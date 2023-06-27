import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import PersonListItem from '@/components/PersonListItem.vue';
import { createVuetify } from 'vuetify';
import { usePeopleStore } from '@/stores/people';
const vuetify = createVuetify();

const defaultPerson = ({
  id = 'id-123',
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

const defaultProps = ({ person = defaultPerson(), index = 2, ...args } = {}) => ({
  person,
  index,
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

    it('renders a delete button', () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-button-delete"]').exists()).toBe(true);
    });
  });

  describe('Deleting a person', () => {
    it('opens a confirmation dialog when the delete button is clicked', async () => {
      const wrapper = mount(PersonListItem, {
        props: defaultProps(),
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-item-dialog-delete"]').exists()).toBe(false);
      const deleteButtonWrapper = wrapper.findComponent(
        '[data-vitest="person-list-item-button-delete"]'
      );
      await deleteButtonWrapper.trigger('click');
      expect(wrapper.find('[data-vitest="person-list-item-dialog-delete"]').exists()).toBe(true);
    });

    it("deletes a person when the dialog's delete button is clicked", async () => {
      const personToRemove = defaultPerson({ id: 'id-456' });
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [defaultPerson({ id: 'id-123' }), personToRemove, defaultPerson({ id: 'id-789' })],
      });
      expect(peopleStore.people).toHaveLength(3);

      const wrapper = mount(PersonListItem, {
        props: defaultProps({ person: personToRemove }),
        global: defaultGlobal(),
      });
      wrapper.vm.showDeleteDialog = true;
      await wrapper.vm.$nextTick();
      const confirmDeleteButtonWrapper = wrapper.findComponent(
        '[data-vitest="person-list-item-button-confirm-delete"]'
      );
      await confirmDeleteButtonWrapper.trigger('click');
      expect(peopleStore.people).toHaveLength(2);
    });
  });
});
