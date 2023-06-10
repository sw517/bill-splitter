<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  person: Person;
  index: number;
}>();

const showDeleteDialog = ref(false);
const selectedPersonIdToDelete: Ref<Person['id']> = ref(null);
const { currencyIcon } = storeToRefs(useGeneralStore());
const peopleStore = usePeopleStore();
const nameLabel = computed(() => {
  return `Person ${props.index + 1}`;
});

const onInput = <Key extends keyof Person>(input: Person[Key], field: Key) => {
  peopleStore.editPerson(props.person.id, field, input);
};

const onNameInput = (input: Person['name']) => {
  if (!input) {
    onInput(nameLabel.value, 'fallbackName');
  }
  onInput(input, 'name');
};

const onDelete = (personId: Person['id']) => {
  selectedPersonIdToDelete.value = personId;
  showDeleteDialog.value = true;
};

const onDeleteConfirm = (id: Person['id']) => {
  peopleStore.deletePerson(selectedPersonIdToDelete.value);
};
</script>

<template>
  <VRow class="d-flex align-center" dense>
    <VCol cols="6">
      <VTextField
        :label="nameLabel"
        :model-value="person.name"
        outlined
        hide-details
        @update:modelValue="onNameInput($event)"
      >
        <template v-if="peopleStore.defaultPayer === person.id" #prepend-inner>
          <VTooltip
            open-on-click
            max-width="260"
            text="Default bill payer - new bills will make this person the default payer"
          >
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
        @update:modelValue="onInput(Number($event), 'income')"
      >
        <template #prepend-inner>
          <VIcon size="x-small" :icon="currencyIcon" />
        </template>
      </VTextField>
    </VCol>
    <VCol v-if="index > 0" cols="2" sm="1" class="text-right">
      <VBtn
        icon="mdi-delete"
        title="Remove"
        color="error"
        flat
        size="x-small"
        @click="onDelete(person.id)"
      />
    </VCol>
  </VRow>
  <VDialog>
    <VBtn>Delete Person</VBtn>
  </VDialog>
</template>

<style lang="scss">
$tooltip-background-color: black;
</style>
