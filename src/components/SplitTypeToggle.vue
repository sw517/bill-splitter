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
        <VLabel class="split-type-prepend-label">Equal</VLabel>
      </template>
    </VSwitch>
  </div>
</template>

<style lang="scss" scoped>
.split-type-prepend-label {
  padding-left: 0;
}
</style>
