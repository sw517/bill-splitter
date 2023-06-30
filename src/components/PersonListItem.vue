<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  person: Person;
  index: number;
}>();

const showDeleteDialog = ref(false);
const { currencyIcon } = storeToRefs(useGeneralStore());
const peopleStore = usePeopleStore();
const nameLabel = computed(() => {
  return `Person ${props.index + 1}`;
});

const onInput = <Key extends keyof Person>(input: Person[Key], field: Key) => {
  peopleStore.editPerson(props.person.id, field, input);
};

const onNameInput = (input: Person['name']) => {
  if (!input?.trim()) {
    onInput(nameLabel.value, 'fallbackName');
  }
  onInput(input.trim(), 'name');
};

const onDelete = () => {
  showDeleteDialog.value = true;
};

const onDeleteConfirm = () => {
  peopleStore.deletePerson(props.person.id);
};

defineExpose({ showDeleteDialog });
</script>

<template>
  <VRow v-bind="$attrs" class="flex items-center" dense>
    <VCol cols="6">
      <VTextField
        :label="nameLabel"
        :model-value="person.name"
        outlined
        hide-details
        data-vitest="person-list-item-input-name"
        @update:modelValue="onNameInput($event)"
      >
        <template v-if="peopleStore.defaultPayer === person.id" #prepend-inner>
          <VTooltip open-on-click max-width="260" text="Default bill payer">
            <template #activator="{ props }">
              <VIcon v-bind="props" icon="mdi-account-star" size="small" />
            </template>
          </VTooltip>
        </template>
      </VTextField>
    </VCol>
    <VCol>
      <VTextField
        label="Income"
        :model-value="person.income"
        type="number"
        hide-details
        data-vitest="person-list-item-input-income"
        @update:modelValue="onInput(Number($event), 'income')"
      >
        <template #prepend-inner>
          <VIcon size="x-small" :icon="currencyIcon" />
        </template>
      </VTextField>
    </VCol>
    <VCol cols="2" sm="1" class="text-right">
      <VBtn
        icon="mdi-delete"
        title="Remove person"
        color="error"
        flat
        size="x-small"
        data-vitest="person-list-item-button-delete"
        @click="onDelete"
      />
    </VCol>
  </VRow>
  <VDialog v-model:model-value="showDeleteDialog" data-vitest="person-list-item-dialog-delete">
    <VCard>
      <VCardTitle>Remove Person</VCardTitle>
      <VCardSubtitle>Are you sure you want to remove this person?</VCardSubtitle>
      <VCardActions class="mt-1 justify-between">
        <VBtn variant="text" @click="showDeleteDialog = false">Cancel</VBtn>
        <VBtn
          color="error"
          variant="flat"
          data-vitest="person-list-item-button-confirm-delete"
          @click="onDeleteConfirm"
          >Remove</VBtn
        >
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
$tooltip-background-color: black;
</style>
