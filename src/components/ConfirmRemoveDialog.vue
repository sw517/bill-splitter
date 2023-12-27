<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'confirm']);
defineProps<{
  modelValue: boolean;
  title: string;
  entity?: string;
  subtitle?: string;
}>();
</script>

<template>
  <VDialog
    :model-value="modelValue"
    max-width="420"
    data-vitest="confirm-delete-dialog"
    v-bind="$attrs"
  >
    <VCard>
      <VCardTitle>{{ title }}</VCardTitle>
      <VCardSubtitle class="whitespace-normal">
        <span v-if="subtitle">{{ subtitle }}</span>
        <span v-else>Are you sure you want to remove this {{ entity }}?</span>
      </VCardSubtitle>
      <VCardActions class="justify-between px-6 py-4">
        <VBtn variant="text" @click="emit('update:modelValue', false)">Cancel</VBtn>
        <VBtn
          color="error"
          variant="flat"
          data-vitest="confirm-delete-dialog-button-confirm-delete"
          @click="emit('confirm')"
          >Remove</VBtn
        >
      </VCardActions>
    </VCard>
  </VDialog>
</template>
