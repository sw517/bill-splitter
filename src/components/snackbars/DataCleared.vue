<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();
</script>

<template>
  <VSnackbar :model-value="modelValue" timeout="4000" v-bind="$attrs">
    <div class="flex align-center">
      <VIcon icon="mdi-database-refresh" class="mr-3" />
      <span>Local data cleared</span>
    </div>
  </VSnackbar>
</template>
