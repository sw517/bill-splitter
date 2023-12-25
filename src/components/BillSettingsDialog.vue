<script setup lang="ts">
import { BillFrequency, type Bill, SplitType } from '@/types/Bill';
import { useBillsStore } from '@/stores/bills';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: boolean;
  bill: Bill;
}>();

const billsStore = useBillsStore();
const { currencyIcon } = storeToRefs(useGeneralStore());
const { people } = storeToRefs(usePeopleStore());
const showDeleteConfirmDialog = ref(false);

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

const onBillDelete = () => {
  showDeleteConfirmDialog.value = true;
};

const onBillDeleteConfirm = () => {
  billsStore.deleteBill(props.bill.id);
  emit('update:modelValue', false);
};

const belongsToEveryone = computed(() => {
  if (props.bill.belongsTo.length === peopleOptions.value.length) {
    return true;
  }
  return false;
});
</script>

<template>
  <VDialog :model-value="modelValue" max-width="768px" data-vitest="bill-list-item-dialog">
    <VCard>
      <VCardTitle class="flex justify-between">
        <span class="whitespace-normal block mr-6">
          {{ bill.name || 'Unnamed bill' }}
        </span>
        <span class="inline-flex items-baseline">
          <VIcon :icon="currencyIcon" size="x-small" />
          {{ bill.cost }}
        </span>
      </VCardTitle>
      <VCardText>
        <VContainer fluid class="p-0">
          <VRow>
            <VCol cols="12" md="4">
              <VSelect
                label="Frequency"
                :model-value="bill.frequency"
                :items="billFrequencyOptions"
                data-vitest="bill-list-item-input-frequency"
                hide-details
                @update:modelValue="onInput($event, 'frequency')"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VSelect
                label="Paid by"
                :model-value="bill.paidBy"
                :items="peopleOptions"
                data-vitest="bill-list-item-input-paidby"
                prepend-inner-icon="mdi-bank-transfer-out"
                hide-details
                @update:modelValue="onInput($event, 'paidBy')"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VSelect
                label="Belongs to"
                :model-value="bill.belongsTo"
                :items="peopleOptions"
                multiple
                data-vitest="bill-list-item-input-belongsto"
                hide-details
                prepend-inner-icon="mdi-account-group"
                @update:modelValue="onInput($event, 'belongsTo')"
              >
                <template v-if="belongsToEveryone" #selection="{ index }">
                  <span v-if="index === 0"> Everyone </span>
                </template>
              </VSelect>
            </VCol>
            <VCol cols="12">
              <VCard variant="outlined" class="p-4">
                <span>Split Type</span>
                <VTooltip open-on-click location="top">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" size="sm" class="ml-4">mdi-help-circle-outline</VIcon>
                  </template>
                  <div>
                    <p>This determines how the cost of bills is shared.</p>
                    <p>
                      If <strong>Income Ratio</strong> is selected, bills will be split unequally
                      using income.
                    </p>
                  </div>
                </VTooltip>
                <VSwitch
                  v-model="bill.splitType"
                  :false-value="SplitType.EQUAL"
                  :true-value="SplitType.RATIO"
                  density="compact"
                  hide-details
                >
                  <template #prepend>
                    <VLabel>
                      <VIcon icon="mdi-scale-balance" size="small" class="mr-2" />
                      <span>Equal</span>
                    </VLabel>
                  </template>
                  <template #label>
                    <span>Income Ratio</span>
                    <VIcon icon="mdi-scale-unbalanced" size="small" class="ml-2" />
                  </template>
                </VSwitch>
              </VCard>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions class="flex justify-between px-6 pb-6">
        <VBtn variant="flat" color="error" prepend-icon="mdi-delete" @click="onBillDelete"
          >Remove bill</VBtn
        >
        <VBtn variant="flat" color="primary" @click="emit('update:modelValue')">Close</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

  <!-- Confirm Dialog -->
  <VDialog
    v-model:model-value="showDeleteConfirmDialog"
    max-width="420"
    data-vitest="bill-list-item-dialog-delete"
  >
    <VCard>
      <VCardTitle>Remove Bill</VCardTitle>
      <VCardSubtitle class="whitespace-normal"
        >Are you sure you want to remove this bill?</VCardSubtitle
      >
      <VCardActions class="justify-between px-6 py-4">
        <VBtn variant="text" @click="showDeleteConfirmDialog = false">Cancel</VBtn>
        <VBtn
          color="error"
          variant="flat"
          data-vitest="bill-list-item-button-confirm-delete"
          @click="onBillDeleteConfirm"
          >Remove</VBtn
        >
      </VCardActions>
    </VCard>
  </VDialog>
</template>
