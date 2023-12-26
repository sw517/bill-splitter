<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';
import type { CurrencyIcon } from '@/types/General';

const emit = defineEmits<{
  (e: 'settings-click', person: Person): void;
}>();

const props = defineProps<{
  person: Person;
  index: number;
  currencyIcon: CurrencyIcon;
  autofocus?: boolean;
}>();

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
</script>

<template>
  <VRow v-bind="$attrs" class="flex items-center" dense>
    <VCol cols="6" class="v-col--full-width-xxs-only">
      <VTextField
        :label="person.fallbackName"
        :model-value="person.name"
        outlined
        hide-details
        data-vitest="person-list-item-input-name"
        :autofocus="autofocus"
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
        label="Monthly Income"
        :model-value="person.income"
        input-type="number"
        hide-details
        data-vitest="person-list-item-input-income"
        @update:modelValue="onInput(Number($event), 'income')"
      >
        <template #prepend-inner>
          <VIcon size="x-small" :icon="currencyIcon" />
        </template>
      </VTextField>
    </VCol>
    <VCol cols="auto" class="text-right">
      <VBtn
        icon="mdi-cog"
        title="Settings"
        color="primary"
        flat
        size="x-small"
        data-vitest="person-list-item-button-settings"
        @click="emit('settings-click', person)"
      />
    </VCol>
  </VRow>
</template>

<style lang="scss">
$tooltip-background-color: black;
</style>
