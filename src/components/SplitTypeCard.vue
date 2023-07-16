<script setup lang="ts">
import SplitTypeToggle from '@/components/SplitTypeToggle.vue';
</script>

<template>
  <VCard>
    <VCardTitle>
      <span>Split Type</span>
      <VTooltip open-on-click location="top">
        <template #activator="{ props }">
          <VIcon v-bind="props" size="sm" class="ml-4">mdi-help-circle-outline</VIcon>
        </template>
        <div>
          <p>This determines how the cost of bills is shared.</p>
          <p>
            If <strong>Income Ratio</strong> is selected, bills will be split unequally using
            income.
          </p>
        </div>
      </VTooltip>
    </VCardTitle>
    <VCardText>
      <SplitTypeToggle />
    </VCardText>
  </VCard>
</template>
