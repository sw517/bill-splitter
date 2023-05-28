<script setup lang="ts">
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';

const props = defineProps<{
  person: Person;
  placeholder: string;
}>();

const peopleStore = usePeopleStore();

const onInput = <Key extends keyof Person>(input: Person[Key], field: Key) => {
  peopleStore.editPerson(props.person.id, field, input);
};
</script>

<template>
  <div class="d-flex">
    <VTextField
      :label="placeholder"
      :model-value="person.name"
      @update:modelValue="onInput($event, 'name')"
    />
    <VTextField
      label="Income"
      :model-value="person.income"
      type="number"
      @update:modelValue="onInput(Number($event), 'income')"
    />
  </div>
</template>
