import { ref, Ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Person } from '@/types/Person';

const blankPerson = ({
  name = '',
  fallbackName = '',
  id = uuidv4(),
  income = 0,
  color = '#000',
} = {}): Person => ({
  name,
  fallbackName,
  id,
  income,
  color,
});

export const usePeopleStore = defineStore('people', () => {
  const people = ref([
    blankPerson({ fallbackName: 'Person #1' }),
    blankPerson({ fallbackName: 'Person #2' }),
  ]);

  const defaultPayer: Ref<Person['id']> = ref(people.value[0].id);

  function addPerson() {
    people.value.push(blankPerson());
  }

  function getPersonById(id: Person['id']): Person | undefined {
    return people.value?.find((person: Person) => person.id === id);
  }

  function editPerson<Key extends keyof Person>(
    id: Person['id'],
    field: Key,
    input: Person[Key]
  ): void {
    const personIndex: number = people.value.findIndex((person: Person) => person.id === id);
    if (personIndex === -1) return;
    people.value[personIndex][field] = input;
  }

  function deletePerson(id: Person['id']): void {
    people.value = people.value?.filter((person: Person) => person.id !== id);
  }

  return { people, addPerson, editPerson, getPersonById, deletePerson, defaultPayer };
});
