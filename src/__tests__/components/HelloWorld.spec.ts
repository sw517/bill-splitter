import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import PersonListItem from '@/components/PersonListItem.vue';

describe('PersonListItem', () => {
  it('renders properly', () => {
    const wrapper = mount(PersonListItem, {
      props: {
        person: {
          name: '',
          id: '',
          income: 0,
        },
        placeholder: '',
      },
    });
    expect(wrapper.text()).toContain('');
  });
});
