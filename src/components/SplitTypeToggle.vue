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
    >
      <template #prepend>
        <VLabel>Equal</VLabel>
      </template>
    </VSwitch>
  </div>
</template>

<style scoped></style>
