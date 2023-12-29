<script setup lang="ts">
defineProps({
  modelValue: Boolean,
});
</script>

<template>
  <VSnackbar :model-value="modelValue" vertical timeout="10000" max-width="95vw" width="420">
    <div class="flex">
      <div>
        <div class="text-subtitle-1 pb-2 font-bold">Session restored</div>
        <p>Your data has been restored from your last session.</p>
      </div>
      <img class="ml-6" src="@/assets/images/cookie.svg" alt="" />
    </div>
    <template #actions>
      <VBtn
        variant="flat"
        color="error"
        data-vitest="load-storage-snackbar-button-clear"
        @click="$emit('clear-storage-clicked')"
        >Clear data</VBtn
      >
      <VBtn variant="flat" color="primary" class="ml-4" @click="$emit('update:modelValue', false)"
        >Close</VBtn
      >
    </template>
  </VSnackbar>
</template>

<style scoped>
img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
</style>
