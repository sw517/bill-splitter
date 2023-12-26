<script setup lang="ts">
import { SplitType } from '@/types/Bill';

const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue: SplitType;
}>();
</script>

<template>
  <span>Split Type</span>
  <VTooltip open-on-click location="top">
    <template #activator="{ props }">
      <VIcon v-bind="props" size="sm" class="ml-4">mdi-help-circle-outline</VIcon>
    </template>
    <div>
      <p>This determines how the cost of bills is shared.</p>
      <p>
        If <strong>Income Ratio</strong> is selected, bills will be split unequally using income.
      </p>
    </div>
  </VTooltip>
  <VRadioGroup
    :model-value="modelValue"
    class="mt-2"
    hide-details
    @update:model-value="emit('update:modelValue', $event)"
  >
    <VRadio :true-value="SplitType.EQUAL" :false-value="SplitType.RATIO">
      <template #label>
        <VIcon size="small" icon="mdi-scale-balance" class="mr-2" />
        <span>{{ SplitType.EQUAL }}</span>
      </template>
    </VRadio>
    <VRadio :false-value="SplitType.EQUAL" :true-value="SplitType.RATIO">
      <template #label>
        <VIcon size="small" icon="mdi-scale-unbalanced" class="mr-2" />
        <span>{{ SplitType.RATIO }}</span>
      </template>
    </VRadio>
  </VRadioGroup>
</template>
