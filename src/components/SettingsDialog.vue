<script setup lang="ts">
import { type Ref, ref } from 'vue';
import SplitType from '@/components/SplitType.vue';
import { useGeneralStore } from '../stores/general';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { Currency, CurrencyIcon } from '@/types/General';

defineProps({
  modelValue: Boolean,
});

const billsStore = useBillsStore();
const peopleStore = usePeopleStore();
const generalStore = useGeneralStore();
const currencyOptions = Object.keys(Currency);
const showCopyDataSnackbar: Ref<boolean> = ref(false);
const showLoadDataInput: Ref<boolean> = ref(false);
const loadDataInput: Ref<string> = ref('');

const onCopyClick = () => {
  try {
    const generalData = localStorage.getItem('general');
    const billsData = localStorage.getItem('bills');
    const peopleData = localStorage.getItem('people');

    const stringifiedData = JSON.stringify({
      general: generalData ? JSON.parse(generalData) : undefined,
      bills: billsData ? JSON.parse(billsData) : undefined,
      people: peopleData ? JSON.parse(peopleData) : undefined,
    });

    navigator.clipboard.writeText(stringifiedData);
    showCopyDataSnackbar.value = true;
  } catch (e) {}
};

const onBackClick = () => {
  loadDataInput.value = '';
  showLoadDataInput.value = false;
};

const onPasteClick = async () => {
  loadDataInput.value = await navigator.clipboard.readText();
};

const onSaveClick = () => {
  if (!loadDataInput.value) {
    return;
  }

  try {
    const parsedData = JSON.parse(loadDataInput.value);
    const { general, bills, people } = parsedData;

    if (general) {
      try {
        generalStore.$patch(general);
      } catch (error) {
        generalStore.$reset();
      }
    }
    if (bills) {
      try {
        billsStore.$patch(bills);
      } catch (error) {
        billsStore.$reset();
      }
    }
    if (people) {
      try {
        peopleStore.$patch(people);
      } catch (error) {
        peopleStore.$reset();
      }
    }
  } catch (error) {}
};
</script>

<template>
  <VDialog max-width="768" :model-value="modelValue" v-bind="$attrs">
    <VCard>
      <VCardTitle>Settings</VCardTitle>
      <Transition>
        <VCardText v-if="!showLoadDataInput">
          <VBtn
            variant="outlined"
            prepend-icon="mdi-content-copy"
            class="mb-4 w-full sm:w-auto"
            data-vitest="settings-button-copy-data"
            @click="onCopyClick"
            >Copy data</VBtn
          >
          <VBtn
            variant="outlined"
            prepend-icon="mdi-content-paste"
            class="mb-4 sm:ml-4 w-full sm:w-auto"
            data-vitest="settings-button-load-data-view"
            @click="showLoadDataInput = true"
            >Load data</VBtn
          >
          <VCard variant="outlined">
            <VCardText>
              <VSwitch
                v-model="generalStore.autosave"
                label="Autosave"
                hint="Automatically save changes to local storage"
                data-vitest="settings-toggle-autosave"
                density="compact"
                persistent-hint
              />
            </VCardText>
          </VCard>
          <VSelect
            label="Currency symbol"
            v-model:model-value="generalStore.currency"
            :items="currencyOptions"
            density="compact"
            hide-details
            class="mt-6"
          >
            <template #item="{ item, props }">
              <VListItem v-bind="props" :prepend-icon="CurrencyIcon[item.value as Currency]">
                <template #title>{{ item.value }}</template>
              </VListItem>
            </template>
            <template #selection="{ item }">
              <div class="flex items-center">
                <VIcon :icon="CurrencyIcon[item.value as Currency]" class="mr-4" size="small" />
                <div>{{ item.value }}</div>
              </div>
            </template>
          </VSelect>
          <VCard variant="outlined" class="mt-4 p-4">
            <SplitType v-model:model-value="billsStore.splitType" />
          </VCard>
        </VCardText>
        <VCardText v-else>
          <VBtn
            variant="text"
            prepend-icon="mdi-arrow-left"
            data-vitest="settings-button-back"
            class="mb-4"
            @click="onBackClick"
            >Back</VBtn
          >
          <VTextarea
            v-model:model-value="loadDataInput"
            label="Load data"
            rows="3"
            data-vitest="settings-input-load-data"
          />
          <div class="flex align-center justify-end">
            <VBtn
              variant="text"
              prepend-icon="mdi-content-paste"
              data-vitest="settings-button-paste"
              class="mr-3"
              @click="onPasteClick"
              >Paste</VBtn
            >
            <VBtn
              variant="flat"
              color="secondary"
              prepend-icon="mdi-content-save"
              data-vitest="settings-button-save"
              @click="onSaveClick"
              >Save</VBtn
            >
          </div>
        </VCardText>
      </Transition>
      <VCardActions class="justify-between px-6 py-4">
        <VBtn
          variant="flat"
          color="error"
          data-vitest="settings-button-clear"
          @click="$emit('clear-storage-clicked')"
        >
          Clear data
        </VBtn>
        <VBtn variant="flat" color="primary" @click="$emit('update:modelValue', false)">
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VSnackbar v-model:model-value="showCopyDataSnackbar" timeout="4000">
    <div class="flex align-center">
      <VIcon icon="mdi-content-copy" class="mr-3" />
      <span>Data copied to clipboard</span>
    </div>
  </VSnackbar>
</template>

<style scoped></style>
