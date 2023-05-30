<script setup lang="ts">
import SplitTypeToggle from './components/SplitTypeToggle.vue';
import PersonList from './components/PersonList.vue';
import BillList from './components/BillList.vue';
import OutgoingsList from './components/OutgoingsList.vue';
</script>

<template>
  <header></header>
  <main>
    <SplitTypeToggle class="m-b-1" />
    <PersonList class="mb-1" />
    <BillList class="mb-1" />
    <OutgoingsList class="mb-1" />
  </main>
</template>
