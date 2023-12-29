<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();
</script>

<template>
  <VSnackbar :model-value="modelValue" timeout="4000" v-bind="$attrs">
    <div class="flex align-center">
      <VIcon icon="mdi-database-check" class="mr-3" />
      <span>Data updated successfully</span>
    </div>
  </VSnackbar>
</template>
