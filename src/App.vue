<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useTheme } from 'vuetify';
import PersonList from './components/PersonList.vue';
import BillList from './components/BillList.vue';
import OutgoingsList from './components/OutgoingsList.vue';
import NavigationBar from './components/NavigationBar.vue';
const theme = useTheme();

onBeforeMount(() => {
  //check if browser supports dark mode.
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
    theme.global.name.value = 'customDarkTheme';

    //if user prefers light mode switch to light mode
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme.global.name.value = 'customLightTheme';
    }
  }
});
</script>

<template>
  <VApp>
    <VLayout>
      <NavigationBar />
      <VMain class="px-4">
        <PersonList class="mt-4 mb-1" />
        <BillList class="mb-1" />
        <OutgoingsList class="mb-1" />
      </VMain>
    </VLayout>
  </VApp>
</template>

<style lang="scss">
@import './assets/styles/app.scss';
</style>
