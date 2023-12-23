<script setup lang="ts">
import type { VSwitch } from 'vuetify/components';
import { SplitType } from '@/types/Bill';
import { useBillsStore } from '@/stores/bills';

const billStore = useBillsStore();
</script>

<template>
  <div>
    <VSwitch
      v-model="billStore.splitType"
      label="Income Ratio"
      :false-value="SplitType.EQUAL"
      :true-value="SplitType.RATIO"
      density="compact"
      hide-details
    >
      <template #prepend>
        <VLabel>
          <VIcon icon="mdi-scale-balance" size="small" class="mr-2" />
          <span>Equal</span>
        </VLabel>
      </template>
      <template #label>
        <span>Income Ratio</span>
        <VIcon icon="mdi-scale-unbalanced" size="small" class="ml-2" />
      </template>
    </VSwitch>
  </div>
</template>

<style lang="scss" scoped></style>
