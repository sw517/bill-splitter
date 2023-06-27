import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { mount } from '@vue/test-utils';
import PersonList from '@/components/PersonList.vue';
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

const defaultGlobal = () => ({
  plugins: [vuetify],
});

describe('PersonList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('DOM Rendering', () => {
    it('renders an add person button', () => {
      const wrapper = mount(PersonList, {
        global: defaultGlobal(),
      });
      expect(wrapper.find('[data-vitest="person-list-button-add-person"]').exists()).toBe(true);
    });

    it('renders a PersonListItem for each person in the store', () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({
        people: [
          defaultPerson({ id: 'id-123', name: 'Jim' }),
          defaultPerson({ id: 'id-456', name: 'Bob' }),
        ],
      });
      const wrapper = mount(PersonList, {
        global: defaultGlobal(),
      });
      expect(wrapper.findAll('[data-vitest="person-list-item"]')).toHaveLength(2);
    });
  });

  describe('Events', () => {
    it('adds a person when the add person button is clicked', async () => {
      const peopleStore = usePeopleStore();
      peopleStore.$patch({ people: [] });

      const wrapper = mount(PersonList, {
        global: defaultGlobal(),
      });
      await wrapper.find('[data-vitest="person-list-button-add-person"]').trigger('click');
      expect(peopleStore.people).toHaveLength(1);
    });
  });
});
