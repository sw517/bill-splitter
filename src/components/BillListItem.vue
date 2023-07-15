<script setup lang="ts">
import { BillFrequency, type Bill } from '@/types/Bill';
import { useBillsStore } from '@/stores/bills';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = defineProps<{
  bill: Bill;
  index: number;
}>();

const billsStore = useBillsStore();
const { currencyIcon } = storeToRefs(useGeneralStore());
const { people } = storeToRefs(usePeopleStore());
const showConfigureDialog = ref(false);

const onInput = <Key extends keyof Bill>(input: Bill[Key], field: Key) => {
  billsStore.editBill(props.bill.id, field, input);
};

const billFrequencyOptions = (Object.keys(BillFrequency) as Array<keyof typeof BillFrequency>).map(
  (key) => BillFrequency[key]
);

const peopleOptions = computed(() =>
  people.value.map((person) => ({
    title: person.name || person.fallbackName,
    value: person.id,
  }))
);

const showError = computed(() => {
  if (props.bill.belongsTo.length === 0 || !props.bill.paidBy) {
    return true;
  }
  return false;
});

defineExpose({ showConfigureDialog });
</script>

<template>
  <VRow class="flex items-center" dense>
    <!-- Todo: Show if bill is unaccounted for if a person is deleted -->
    <VCol cols="6">
      <VTextField
        label="Description"
        :model-value="bill.name"
        hide-details
        data-vitest="bill-list-item-input-description"
        @update:modelValue="onInput($event, 'name')"
      />
    </VCol>
    <VCol>
      <VTextField
        label="Cost"
        :model-value="bill.cost"
        type="number"
        hide-details
        data-vitest="bill-list-item-input-cost"
        @update:modelValue="onInput(Number($event), 'cost')"
      >
        <template #prepend-inner>
          <VIcon size="x-small" :icon="currencyIcon" />
        </template>
      </VTextField>
    </VCol>
    <VCol cols="auto" sm="1" class="text-right">
      <VIcon
        v-if="showError"
        icon="mdi-exclamation-thick"
        color="error"
        data-vitest="bill-list-item-icon-error"
      />
      <VBtn
        flat
        icon="mdi-cog"
        title="Configure bill"
        color="primary"
        size="x-small"
        data-vitest="bill-list-item-button-configure"
        @click="showConfigureDialog = true"
      />
    </VCol>
    <VDialog v-model:model-value="showConfigureDialog" data-vitest="bill-list-item-dialog">
      <VCard>
        <VCardTitle class="flex justify-between">
          <span>
            {{ bill.name || 'Unnamed bill' }}
          </span>
          <span class="inline-flex items-baseline">
            <VIcon :icon="currencyIcon" size="x-small" />
            {{ bill.cost }}
          </span>
        </VCardTitle>
        <VCardText>
          <VSelect
            label="Frequency"
            :model-value="bill.frequency"
            :items="billFrequencyOptions"
            data-vitest="bill-list-item-input-frequency"
            @update:modelValue="onInput($event, 'frequency')"
          />
          <!-- Todo: Change input text to show 'Everyone' if all are selected -->
          <VSelect
            label="Belongs to"
            :model-value="bill.belongsTo"
            :items="peopleOptions"
            multiple
            data-vitest="bill-list-item-input-belongsto"
            @update:modelValue="onInput($event, 'belongsTo')"
          />
          <VSelect
            label="Paid by"
            :model-value="bill.paidBy"
            :items="peopleOptions"
            data-vitest="bill-list-item-input-paidby"
            @update:modelValue="onInput($event, 'paidBy')"
          />
        </VCardText>
        <VCardActions class="flex justify-between">
          <VBtn @click="showConfigureDialog = false">Close</VBtn>
          <VBtn variant="flat" color="error" prepend-icon="mdi-delete">Remove bill</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
