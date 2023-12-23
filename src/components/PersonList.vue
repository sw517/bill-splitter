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
        data-vitest="person-list-item"
        class="mb-3"
      />
      <VRow dense>
        <VCol />
        <VCol cols="auto">
          <VBtn
            flat
            color="primary"
            prepend-icon="mdi-plus"
            data-vitest="person-list-button-add-person"
            @click="addPerson"
          >
            Add person
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>
