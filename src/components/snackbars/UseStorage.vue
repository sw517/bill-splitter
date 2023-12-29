<script setup lang="ts">
defineProps({
  modelValue: Boolean,
});
</script>
<template>
  <VSnackbar
    :model-value="modelValue"
    vertical
    timeout="-1"
    class="ml-2"
    width="420"
    max-width="95vw"
  >
    <div class="flex">
      <div>
        <div class="text-subtitle-1 pb-2 font-bold">Enable saving on this device!</div>
        <p class="pb-2">You can save your data using local storage on this device.</p>
        <p>No data will be stored or transferred online.</p>
      </div>
      <img class="ml-6" src="@/assets/images/cookie.svg" alt="" />
    </div>
    <template #actions>
      <VBtn class="mr-4" @click="$emit('update:modelValue', false)">Don't save</VBtn>
      <VBtn
        variant="flat"
        color="primary"
        data-vitest="use-storage-snackbar-button-enable"
        @click="$emit('enable-autosave-clicked')"
        >Enable autosave</VBtn
      >
    </template>
  </VSnackbar>
</template>

<style scoped>
img {
  width: 65px;
  height: 65px;
  object-fit: contain;
}
</style>
