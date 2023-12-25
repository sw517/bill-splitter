<script setup lang="ts">
import type { Person } from '@/types/Person';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';

const props = defineProps<{
  modelValue: boolean;
  person: Person;
}>();

const peopleStore = usePeopleStore();
const billsStore = useBillsStore();
const { currencyIcon } = storeToRefs(useGeneralStore());

const showConfirmDelete = ref(false);

const onMakeDefaultClick = () => {
  peopleStore.defaultPayer = props.person.id;
};

const onDeleteConfirm = () => {
  peopleStore.deletePerson(props.person.id);

  billsStore.bills.forEach((bill) => {
    if (bill.paidBy === props.person.id) {
      billsStore.editBill(bill.id, 'paidBy', undefined);
    }
    if (bill.belongsTo.includes(props.person.id)) {
      billsStore.editBill(
        bill.id,
        'belongsTo',
        bill.belongsTo.filter((personId) => personId !== props.person.id)
      );
    }
  });
};

defineExpose({ showConfirmDelete });
</script>

<template>
  <VDialog max-width="500" :model-value="modelValue" v-bind="$attrs">
    <VCard>
      <VCardTitle>{{ person.name }}</VCardTitle>
      <VCardText>
        <VCard variant="outlined">
          <VCardText class="p-4">
            <div v-if="peopleStore.defaultPayer === person.id" class="flex align-center mb-3">
              <VIcon class="mr-2" icon="mdi-account-star" />
              <span>Default bill payer for new bills</span>
            </div>
            <VBtn
              v-else
              variant="flat"
              color="primary"
              prepend-icon="mdi-account-star"
              size="small"
              class="mb-3"
              @click="onMakeDefaultClick"
            >
              Make default bill payer for new bills
            </VBtn>
            <div class="flex align-center justify-between">
              <span>Monthly income</span>
              <span>
                <VIcon :icon="currencyIcon" size="x-small" />
                <span>{{ person.income }}</span>
              </span>
            </div>
          </VCardText>
        </VCard>
      </VCardText>
      <VCardActions class="justify-between px-6 py-4">
        <VBtn
          variant="flat"
          color="error"
          data-vitest="person-settings-dialog-delete-button"
          @click="showConfirmDelete = true"
        >
          Remove person
        </VBtn>
        <VBtn variant="flat" color="primary" @click="$emit('update:modelValue', false)">
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Confirm Dialog -->
  <VDialog
    v-model:model-value="showConfirmDelete"
    max-width="420"
    data-vitest="person-list-item-dialog-delete"
  >
    <VCard>
      <VCardTitle>Remove Person</VCardTitle>
      <VCardSubtitle class="whitespace-normal"
        >Are you sure you want to remove this person?</VCardSubtitle
      >
      <VCardActions class="justify-between px-6 py-4">
        <VBtn variant="text" @click="showConfirmDelete = false">Cancel</VBtn>
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
