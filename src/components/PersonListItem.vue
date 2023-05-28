<script setup lang="ts">
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';

const props = defineProps<{
  person: Person;
  placeholder: string;
}>();

const peopleStore = usePeopleStore();

const onInput = (input: string) => {
  peopleStore.editName(props.person.id, input);
};
</script>

<template>
  <div class="d-flex">
    <VTextField :label="placeholder" :model-value="person.name" @update:modelValue="onInput" />
  </div>
</template>
