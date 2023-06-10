<script setup lang="ts">
import OutgoingsListItem from '@/components/OutgoingsListItem.vue';
import SplitTypeToggle from './SplitTypeToggle.vue';
import { usePeopleStore } from '@/stores/people';
import { storeToRefs } from 'pinia';

const { people } = storeToRefs(usePeopleStore());
</script>

<template>
  <VCard title="Total Monthly Outgoings">
    <SplitTypeToggle />
    <OutgoingsListItem
      v-for="person in people"
      :key="person.id"
      :person="person"
    />
  </VCard>
</template>
