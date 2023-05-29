<script setup lang="ts">
import PersonListItem from '@/components/PersonListItem.vue';
import { usePeopleStore } from '@/stores/people';

const peopleStore = usePeopleStore();
const people = peopleStore.people;
const addPerson = peopleStore.addPerson;
</script>

<template>
  <VCard title="People">
    <PersonListItem
      v-for="(person, index) in people"
      :person="person"
      :placeholder="`Person #${index + 1}`"
    />
    <VBtn prepend-icon="mdi-plus" @click="addPerson">Add person</VBtn>
  </VCard>
</template>
