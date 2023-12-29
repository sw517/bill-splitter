<script setup lang="ts">
import { BillFrequency, type Bill, SplitType } from '@/types/Bill';
import { type Person } from '@/types/Person';
import { type CurrencyIcon } from '@/types/General';
import { computed, ref } from 'vue';
import { useBillsStore } from '@/stores/bills';
import { usePeopleStore } from '@/stores/people';

const emit = defineEmits<{
  (e: 'settings-click', bill: Bill): void;
}>();

const props = defineProps<{
  bill: Bill;
  index: number;
  currencyIcon: CurrencyIcon;
  people: Person[];
  descriptionAutocompleteItems: string[];
  autofocus?: boolean;
}>();

const { editBill } = useBillsStore();
const { getNameById } = usePeopleStore();
const showConfigureDialog = ref(false);

const onInput = <Key extends keyof Bill>(input: Bill[Key], field: Key) => {
  editBill(props.bill.id, field, input);
};

const peopleOptions = computed(() =>
  props.people.map((person: Person) => ({
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

const getBillCostSuffix = (bill: Bill) => {
  if (bill.frequency === BillFrequency.MONTHLY) {
    return '/mo';
  }
  return '/yr';
};

const getBillSplitTypeIcon = (bill: Bill) => {
  if (bill.splitType === SplitType.EQUAL) {
    return 'mdi-scale-balance';
  }
  return 'mdi-scale-unbalanced';
};

defineExpose({ showConfigureDialog });
</script>

<template>
  <VRow class="bill-list-item flex items-center" dense>
    <VCol cols="6" class="v-col--full-width-xxs-only">
      <VTextField
        label="Description"
        :model-value="bill.name"
        data-vitest="bill-list-item-input-description"
        hide-details
        :autofocus="autofocus"
        @update:modelValue="onInput($event, 'name')"
      />
      <!-- TODO: Replace TextField when performance of Combobox is fixed -->
      <!-- <v-combobox
        label="Description"
        :model-value="bill.name"
        hide-details
        data-vitest="bill-list-item-input-description"
        :items="descriptionAutocompleteItems"
        :menu-props="{ ...(!bill.name && { modelValue: false }) }"
        @update:modelValue="onInput($event, 'name')"
      /> -->
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
        <template #append-inner>
          <small class="text-gray-400">{{ getBillCostSuffix(bill) }}</small>
        </template>
      </VTextField>
    </VCol>
    <VCol cols="auto" class="text-right">
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
        @click="emit('settings-click', bill)"
      />
    </VCol>
    <VCol cols="12">
      <div class="text-gray-400 flex items-center">
        <div class="flex items-center">
          <VTooltip open-on-click location="top">
            <template #activator="{ props }">
              <VIcon
                v-bind="props"
                class="mr-2"
                size="x-small"
                :icon="getBillSplitTypeIcon(bill)"
              />
            </template>
            <div>Split Type</div>
          </VTooltip>
          <small v-if="bill.splitType === SplitType.EQUAL">Equal split</small>
          <small v-else>Ratio split</small>
        </div>
        <div class="flex items-center ml-6">
          <VTooltip open-on-click location="top">
            <template #activator="{ props }">
              <VIcon v-bind="props" class="mr-2" size="small" icon="mdi-bank-transfer-out" />
            </template>
            <div>Paid by</div>
          </VTooltip>
          <small class="whitespace-nowrap">{{
            (bill.paidBy && getNameById(bill.paidBy, 10)) || 'N/A'
          }}</small>
        </div>
        <div v-if="bill.belongsTo.length" class="flex items-center ml-6">
          <VTooltip open-on-click location="top">
            <template #activator="{ props }">
              <VIcon v-bind="props" class="mr-2" size="x-small" icon="mdi-account-group" />
            </template>
            <div>Bill belongs to</div>
          </VTooltip>
          <small v-if="bill.belongsTo.length === peopleOptions.length">Everyone</small>
          <small class="whitespace-nowrap" v-else>
            {{ getNameById(bill.belongsTo[0], 10) }}
            <span v-if="bill.belongsTo.length > 1">+ {{ bill.belongsTo.length - 1 }}</span>
          </small>
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.bill-list-item :deep(.v-combobox__selection-text) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
