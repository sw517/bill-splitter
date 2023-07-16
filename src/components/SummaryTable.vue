<script setup lang="ts">
import SummaryTableRow from '@/components/SummaryTableRow.vue';
import { usePeopleStore } from '@/stores/people';
import { storeToRefs } from 'pinia';

const { people } = storeToRefs(usePeopleStore());
</script>

<template>
  <VCard title="Total Monthly Outgoings">
    <VTable>
      <thead>
        <tr>
          <th>Person</th>
          <th>Outgoing amount</th>
          <th>Amount owed</th>
        </tr>
      </thead>
      <tbody>
        <SummaryTableRow v-for="person in people" :key="person.id" :person="person" />
      </tbody>
    </VTable>
  </VCard>
</template>
