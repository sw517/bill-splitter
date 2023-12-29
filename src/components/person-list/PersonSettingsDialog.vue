<script setup lang="ts">
import type { Person } from '@/types/Person';
import type { CurrencyIcon } from '@/types/General';
import { ref } from 'vue';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import ConfirmRemoveDialog from '@/components/dialogs/ConfirmRemove.vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: boolean;
  person: Person;
  currencyIcon: CurrencyIcon;
}>();

const peopleStore = usePeopleStore();
const billsStore = useBillsStore();

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

  showConfirmDelete.value = false;
  emit('update:modelValue', false);
};

defineExpose({ showConfirmDelete });
</script>

<template>
  <VDialog
    max-width="500"
    :model-value="modelValue"
    v-bind="$attrs"
    @update:model-value="emit('update:modelValue', false)"
  >
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
              <span class="sm:hidden">Default bill payer </span>
              <span class="hidden sm:block"> Default bill payer for new bills </span>
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

  <ConfirmRemoveDialog
    v-model:model-value="showConfirmDelete"
    title="Remove Person"
    entity="person"
    @confirm="onDeleteConfirm"
  />
</template>
