<script setup lang="ts">
import OutgoingsListItem from '@/components/OutgoingsListItem.vue';
import { usePeopleStore } from '@/stores/people';
import { storeToRefs } from 'pinia';

const { people } = storeToRefs(usePeopleStore());
</script>

<template>
  <VCard title="Total Monthly Outgoings">
    <OutgoingsListItem
      v-for="(person, index) in people"
      :person="person"
      :placeholder="`Person #${index + 1}`"
    />
  </VCard>
</template>
