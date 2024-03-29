<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { onBeforeMount } from 'vue';
import { useTheme, useDisplay } from 'vuetify';
import { useGeneralStore } from './stores/general';
import { useBillsStore } from './stores/bills';
import { usePeopleStore } from './stores/people';
import PersonList from './components/person-list/PersonList.vue';
import BillList from './components/bill-list/BillList.vue';
import SummaryTable from './components/SummaryTable.vue';
import NavigationBar from './components/NavigationBar.vue';
import SettingsDialog from './components/dialogs/GeneralSettings.vue';
import LoadStorageSnackbar from './components/snackbars/LoadStorage.vue';
import UseStorageSnackbar from './components/snackbars/UseStorage.vue';
import DebtSummary from './components/DebtSummary.vue';
import ConfirmRemoveDialog from './components/dialogs/ConfirmRemove.vue';
import DataClearedSnackbar from './components/snackbars/DataCleared.vue';

const theme = useTheme();
const { smAndDown } = useDisplay();

const billsStore = useBillsStore();
const peopleStore = usePeopleStore();
const generalStore = useGeneralStore();

const showSettingsDialog = ref(false);
const showLoadedStorageSnackbar = ref(false);
const showConfirmClearStorage = ref(false);
const showUseStorageSnackbar = ref(false);
const showDataClearedSnackbar = ref(false);

const onCloseLoadedStorageSnackbar = (value: boolean) => {
  showLoadedStorageSnackbar.value = value;
  localStorage.setItem('storageSnackbarDate', new Date().toDateString());
};

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

  const storageSnackbarInteractDate = localStorage.getItem('storageSnackbarDate');
  const hasInteractedWithStorageSnackbar =
    storageSnackbarInteractDate &&
    new Date(storageSnackbarInteractDate).toDateString() === new Date().toDateString();

  if (
    localStorage.getItem('general') ||
    localStorage.getItem('bills') ||
    localStorage.getItem('people')
  ) {
    if (!hasInteractedWithStorageSnackbar) {
      showLoadedStorageSnackbar.value = true;
    }
    loadFromLocalStorage();
  } else {
    showUseStorageSnackbar.value = true;
  }
});

const onClearStorageClicked = () => {
  showConfirmClearStorage.value = true;
};

const onClearStorageConfirm = () => {
  localStorage.clear();
  generalStore.$reset();
  peopleStore.$reset();
  billsStore.$reset();
  showLoadedStorageSnackbar.value = false;
  showConfirmClearStorage.value = false;
  showDataClearedSnackbar.value = true;
};

const onEnableAutosaveClicked = () => {
  generalStore.autosave = true;
  showUseStorageSnackbar.value = false;
};

defineExpose({
  showLoadedStorageSnackbar,
  showSettingsDialog,
  saveToLocalStorage,
  loadFromLocalStorage,
  onClearStorageClicked,
});
</script>

<template>
  <VApp>
    <VLayout>
      <NavigationBar
        @settings-clicked="showSettingsDialog = true"
        data-vitest="app-navigation-bar"
      />
      <VMain class="px-4 pb-10">
        <VContainer class="p-0 md:p-2 mt-16">
          <VRow :no-gutters="smAndDown">
            <VCol cols="12" md="6" class="mb-2 sm:mb-0">
              <PersonList />
            </VCol>
            <VCol cols="12" md="6" class="mb-2 sm:mb-0">
              <BillList />
            </VCol>
            <VCol cols="12" md="6" class="mb-2 sm:mb-0">
              <SummaryTable />
            </VCol>
            <VCol cols="12" md="6" class="mb-2 sm:mb-0">
              <DebtSummary />
            </VCol>
          </VRow>
        </VContainer>
      </VMain>

      <SettingsDialog
        v-model:model-value="showSettingsDialog"
        @clear-storage-clicked="onClearStorageClicked"
        data-vitest="app-dialog-settings"
      />
      <LoadStorageSnackbar
        :model-value="showLoadedStorageSnackbar"
        data-vitest="app-snackbar-load-storage"
        @clear-storage-clicked="onClearStorageClicked"
        @update:model-value="onCloseLoadedStorageSnackbar"
      />
      <UseStorageSnackbar
        v-model:model-value="showUseStorageSnackbar"
        data-vitest="app-snackbar-use-storage"
        @enable-autosave-clicked="onEnableAutosaveClicked"
      />
      <ConfirmRemoveDialog
        v-model:model-value="showConfirmClearStorage"
        title="Clear local data"
        subtitle="Are you sure you want to clear all local data?"
        @confirm="onClearStorageConfirm"
      />
      <DataClearedSnackbar v-model:model-value="showDataClearedSnackbar" />
    </VLayout>
  </VApp>
</template>

<style lang="scss">
@import './assets/styles/app.scss';
</style>
