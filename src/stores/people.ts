import { ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { Person } from '@/types/Person';

const blankPerson = ({ name = '', fallbackName = '', id = uuidv4(), income = 0 } = {}): Person => ({
  name,
  fallbackName,
  id,
  income,
});

const fallbackIncrement = ref(0);
const getFallbackIncrement = () => {
  return (fallbackIncrement.value += 1);
};

export const usePeopleStore = defineStore('people', () => {
  const people = ref([
    blankPerson({ fallbackName: `Person #${getFallbackIncrement()}` }),
    blankPerson({ fallbackName: `Person #${getFallbackIncrement()}` }),
  ]);

  const defaultPayer: Ref<Person['id']> = ref(people.value[0].id);

  const getNameById = (id: Person['id']) => {
    const foundPerson = getPersonById(id);
    return foundPerson?.name || foundPerson?.fallbackName;
  };

  function addPerson() {
    people.value.push(blankPerson({ fallbackName: `Person #${getFallbackIncrement()}` }));
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

    if (defaultPayer.value === id) {
      defaultPayer.value = people.value[0].id;
    }
  }

  function $reset() {
    people.value = [blankPerson(), blankPerson()];
    defaultPayer.value = people.value[0].id;
  }

  return {
    $reset,
    people,
    addPerson,
    editPerson,
    getPersonById,
    deletePerson,
    defaultPayer,
    getNameById,
  };
});
