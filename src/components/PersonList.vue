<script setup lang="ts">
import PersonListItem from '@/components/PersonListItem.vue';
import { usePeopleStore } from '@/stores/people';
import { storeToRefs } from 'pinia';

const { people } = storeToRefs(usePeopleStore());
</script>

<template>
  <VCard>
    <PersonListItem
      v-for="(person, index) in people"
      :person="person"
      :placeholder="`Person #${index + 1}`"
    />
  </VCard>
</template>
