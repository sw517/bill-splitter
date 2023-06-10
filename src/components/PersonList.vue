<script setup lang="ts">
import PersonListItem from '@/components/PersonListItem.vue';
import { usePeopleStore } from '@/stores/people';
import { storeToRefs } from 'pinia';

const peopleStore = usePeopleStore();
const { people } = storeToRefs(peopleStore);
const addPerson = peopleStore.addPerson;
</script>

<template>
  <VCard title="People">
    <VContainer>
      <PersonListItem
        v-for="(person, index) in people"
        :key="person.id"
        :person="person"
        :index="index"
      />
      <VRow dense>
        <VSpacer />
        <VCol cols="auto">
          <VBtn flat color="primary" prepend-icon="mdi-plus" @click="addPerson"> Add person </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>
