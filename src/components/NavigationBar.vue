<script setup lang="ts">
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';
import { Currency, CurrencyIcon } from '@/types/General';

const { currency } = storeToRefs(useGeneralStore());
const currencyOptions = Object.keys(Currency);
console.log(currencyOptions);
</script>

<template>
  <VAppBar
    class="navigation-bar position-fixed"
    density="compact"
    color="primary"
    scroll-behavior="collapse"
    scroll-threshold="10"
  >
    <template #prepend>
      <VAppBarNavIcon icon="mdi-account" size="small" />
    </template>
    <v-app-bar-title>
      <div class="flex items-center pr-4">
        <div class="navigation-bar__title mr-4 grow uppercase">Bill Splitter</div>
        <VSelect
          density="compact"
          hide-details
          v-model:model-value="currency"
          :items="currencyOptions"
          class="grow-0"
        >
          <template #item="{ item, props }">
            <VListItem v-bind="props" :prepend-icon="CurrencyIcon[item.value as Currency]">
              <template #title>{{ item.value }}</template>
            </VListItem>
          </template>
          <template #selection="{ item }">
            <VIcon :icon="CurrencyIcon[item.value as Currency]" class="mr-4" />
            <div>{{ item.value }}</div>
          </template>
        </VSelect>
      </div>
    </v-app-bar-title>
  </VAppBar>
</template>

<style lang="scss">
.navigation-bar__title {
  font-family: var(--custom-title-font);
}
</style>
