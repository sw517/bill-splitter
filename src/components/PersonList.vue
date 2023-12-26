<script setup lang="ts">
import PersonListItem from '@/components/PersonListItem.vue';
import { useGeneralStore } from '@/stores/general';
import { usePeopleStore } from '@/stores/people';

const peopleStore = usePeopleStore();
const { currencyIcon } = useGeneralStore();
const addPerson = peopleStore.addPerson;
</script>

<template>
  <VCard title="People">
    <VCardText>
      <template v-for="(person, index) in peopleStore.people" :key="person.id">
        <VDivider v-if="index !== 0" class="mb-4 v-divider--xxs-only" />
        <PersonListItem
          :person="person"
          :index="index"
          data-vitest="person-list-item"
          :currency-icon="currencyIcon"
          class="mb-3"
        />
      </template>
    </VCardText>
    <VCardActions>
      <VBtn prepend-icon="mdi-plus" data-vitest="person-list-button-add-person" @click="addPerson">
        Add person
      </VBtn>
    </VCardActions>
  </VCard>
</template>
