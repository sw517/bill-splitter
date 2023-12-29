<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { type Person } from '@/types/Person';
import PersonSettingsDialog from '@/components/person-list/PersonSettingsDialog.vue';
import PersonListItem from '@/components/person-list/PersonListItem.vue';
import { useGeneralStore } from '@/stores/general';
import { usePeopleStore } from '@/stores/people';

const peopleStore = usePeopleStore();
const { currencyIcon } = useGeneralStore();
const showSettingsDialog: Ref = ref(false);
const personSelected: Ref<Person | undefined> = ref();
const hasAddedNewPerson: Ref<boolean> = ref(false);

const onPersonSettingsClick = (person: Person) => {
  personSelected.value = person;
  showSettingsDialog.value = true;
};

const handleAddPerson = () => {
  peopleStore.addPerson();
  hasAddedNewPerson.value = true;
};

const autofocus = (index: number) => {
  return hasAddedNewPerson.value && index === peopleStore.people.length - 1;
};
</script>

<template>
  <VCard title="People">
    <VCardText>
      <template v-for="(person, index) in peopleStore.people" :key="person.id">
        <VDivider v-if="index !== 0" class="mb-4 v-divider--xxs-only" />
        <PersonListItem
          :person="person"
          :index="index"
          data-vitest="person-list-item"
          :currency-icon="currencyIcon"
          class="mb-3"
          :autofocus="autofocus(index)"
          @settings-click="onPersonSettingsClick"
        />
      </template>
    </VCardText>
    <VCardActions>
      <VBtn
        prepend-icon="mdi-plus"
        data-vitest="person-list-button-add-person"
        @click="handleAddPerson"
      >
        Add person
      </VBtn>
    </VCardActions>
  </VCard>
  <PersonSettingsDialog
    v-if="personSelected"
    v-model:model-value="showSettingsDialog"
    :person="personSelected"
    :currency-icon="currencyIcon"
  />
</template>
