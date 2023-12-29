<script setup lang="ts">
import { type Ref, ref, computed } from 'vue';
import SplitType from '@/components/SplitType.vue';
import DataCopiedSnackbar from '@/components/snackbars/DataCopied.vue';
import DataSavedSnackbar from '@/components/snackbars/DataSaved.vue';
import { useGeneralStore } from '@/stores/general';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { Currency, CurrencyIcon } from '@/types/General';

const emit = defineEmits(['update:modelValue', 'clear-storage-clicked']);

defineProps({
  modelValue: Boolean,
});

const billsStore = useBillsStore();
const peopleStore = usePeopleStore();
const generalStore = useGeneralStore();
const currencyOptions = Object.keys(Currency);
const showDataSavedSnackbar: Ref<boolean> = ref(false);
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

    showLoadDataInput.value = false;
    loadDataInput.value = '';
    showDataSavedSnackbar.value = true;
  } catch (error) {}
};

const isValidLoadData = computed(() => {
  if (!loadDataInput.value) return true;

  try {
    return !!JSON.parse(loadDataInput.value);
  } catch (error) {
    return false;
  }
});
</script>

<template>
  <VDialog max-width="768" :model-value="modelValue" v-bind="$attrs">
    <VCard>
      <VCardTitle>Settings</VCardTitle>
      <Transition name="fade-slide" mode="out-in">
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
            hint="Data must be a valid JSON format"
            :error="!isValidLoadData"
            :error-messages="
              [!isValidLoadData ? 'Data is not a valid JSON format' : ''].filter(Boolean)
            "
          />
          <div class="flex align-center justify-end mt-4">
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
          @click="emit('clear-storage-clicked')"
        >
          Clear data
        </VBtn>
        <VBtn variant="flat" color="primary" @click="emit('update:modelValue', false)">
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <DataCopiedSnackbar v-model:model-value="showCopyDataSnackbar" />
  <DataSavedSnackbar v-model:model-value="showDataSavedSnackbar" />
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: transform ease 0.3s, opacity ease 0.3s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
