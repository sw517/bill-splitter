<script setup lang="ts">
import SplitType from '@/components/SplitType.vue';
import { useGeneralStore } from '../stores/general';
import { useBillsStore } from '@/stores/bills';

const billStore = useBillsStore();
defineProps({
  modelValue: Boolean,
});

import { Currency, CurrencyIcon } from '@/types/General';

const generalStore = useGeneralStore();
const currencyOptions = Object.keys(Currency);
</script>

<template>
  <VDialog max-width="768" :model-value="modelValue" v-bind="$attrs">
    <VCard>
      <VCardTitle>Settings</VCardTitle>
      <VCardText>
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
          <SplitType v-model:model-value="billStore.splitType" />
        </VCard>
      </VCardText>
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
</template>

<style scoped></style>
