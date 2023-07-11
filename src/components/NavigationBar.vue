<script setup lang="ts">
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';
import { Currency, CurrencyIcon } from '@/types/General';

const { currency } = storeToRefs(useGeneralStore());
const currencyOptions = Object.keys(Currency);
</script>

<template>
  <VAppBar
    class="navigation-bar"
    density="compact"
    color="primary"
    scroll-behavior="collapse"
    scroll-threshold="10"
    scroll-target=".v-main__scroller"
  >
    <template #prepend>
      <VAppBarNavIcon
        data-vitest="navigation-bar-button"
        icon="mdi-cog"
        size="small"
        @click="$emit('settings-clicked')"
      />
    </template>
    <v-app-bar-title>
      <div class="flex items-center pr-4">
        <div class="navigation-bar__title mr-4 grow">Bill Splitter</div>
        <VSelect
          v-model:model-value="currency"
          :items="currencyOptions"
          density="compact"
          hide-details
          class="grow-0"
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
      </div>
    </v-app-bar-title>
  </VAppBar>
</template>

<style lang="scss" scoped>
.navigation-bar {
  :deep(.v-field__input) {
    min-height: var(--v-field-input-min-height);
  }
  :deep(.v-select__selection) {
    margin: 0;
  }
}
.navigation-bar__title {
  font-family: var(--custom-title-font);
}
</style>
