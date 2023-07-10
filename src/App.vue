<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useTheme } from 'vuetify';
import { useGeneralStore } from './stores/general';
import { useBillsStore } from './stores/bills';
import { usePeopleStore } from './stores/people';
import PersonList from './components/PersonList.vue';
import BillList from './components/BillList.vue';
import OutgoingsList from './components/OutgoingsList.vue';
import NavigationBar from './components/NavigationBar.vue';
const theme = useTheme();

const billsStore = useBillsStore();
const peopleStore = usePeopleStore();
const generalStore = useGeneralStore();

const saveToLocalStorage = () => {
  localStorage.setItem('general', JSON.stringify(generalStore.$state));
  localStorage.setItem('bills', JSON.stringify(billsStore.$state));
  localStorage.setItem('people', JSON.stringify(peopleStore.$state));
};

const loadFromLocalStorage = () => {
  const general = localStorage.getItem('general');
  const bills = localStorage.getItem('bills');
  const people = localStorage.getItem('people');

  if (general) {
    try {
      generalStore.$patch(JSON.parse(general));
    } catch (error) {
      generalStore.$reset();
    }
  }
  if (bills) {
    try {
      billsStore.$patch(JSON.parse(bills));
    } catch (error) {
      billsStore.$reset();
    }
  }
  if (people) {
    try {
      peopleStore.$patch(JSON.parse(people));
    } catch (error) {
      peopleStore.$reset();
    }
  }
};

generalStore.$subscribe((_mutation, state) => {
  if (state.autosave) {
    localStorage.setItem('general', JSON.stringify(state));
  }
});

peopleStore.$subscribe((_mutation, state) => {
  if (generalStore.autosave) {
    localStorage.setItem('people', JSON.stringify(state));
  }
});

billsStore.$subscribe((_mutation, state) => {
  if (generalStore.autosave) {
    localStorage.setItem('bills', JSON.stringify(state));
  }
});

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

defineExpose({ saveToLocalStorage, loadFromLocalStorage });
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
