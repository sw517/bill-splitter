<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();
</script>

<template>
  <VSnackbar :model-value="modelValue" timeout="4000" v-bind="$attrs">
    <div class="flex align-center">
      <VIcon icon="mdi-content-copy" class="mr-3" />
      <span>Data copied to clipboard</span>
    </div>
  </VSnackbar>
</template>
