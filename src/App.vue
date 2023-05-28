<script setup lang="ts">
import PersonList from './components/PersonList.vue';
import BillList from './components/BillList.vue';
</script>

<template>
  <header></header>
  <main>
    <PersonList class="mb-1" />
    <BillList />
  </main>
</template>
