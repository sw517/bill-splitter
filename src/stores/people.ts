import { ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Person } from '@/types/Person';

const blankPerson = (): Person => ({
  name: '',
  id: uuidv4(),
  income: 0,
});

export const usePeopleStore = defineStore('people', () => {
  const people = ref([blankPerson(), blankPerson()]);

  const getPersonById = (id: Person['id']): Person | undefined => {
    return people.value?.find((person: Person) => person.id === id);
  };

  function editName(id: Person['id'], name: Person['name']): void {
    const personIndex: number = people.value.findIndex((person: Person) => person.id === id);
    if (personIndex === -1) return;
    people.value[personIndex].name = name;
  }

  return { people, editName, getPersonById };
});
