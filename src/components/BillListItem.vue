<script setup lang="ts">
import { BillFrequency, type Bill, SplitType } from '@/types/Bill';
import { useBillsStore } from '@/stores/bills';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import billAutocompleteItems from '@/assets/data/bill-autocomplete-items';

const props = defineProps<{
  bill: Bill;
  index: number;
}>();

const billsStore = useBillsStore();
const { currencyIcon } = storeToRefs(useGeneralStore());
const { people } = storeToRefs(usePeopleStore());
const { getNameById } = usePeopleStore();
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

const onBillDelete = () => {
  billsStore.deleteBill(props.bill.id);
  showConfigureDialog.value = false;
};

const belongsToEveryone = computed(() => {
  if (props.bill.belongsTo.length === peopleOptions.value.length) {
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
  <VRow class="flex items-center" dense>
    <VCol cols="6">
      <VCombobox
        autofocus
        label="Description"
        :model-value="bill.name"
        hide-details
        data-vitest="bill-list-item-input-description"
        :items="billAutocompleteItems"
        item-title="value"
        item-value="value"
        @update:modelValue="onInput($event, 'name')"
      >
      </VCombobox>
    </VCol>
    <VCol>
      <VTextField
        label="Cost"
        :model-value="bill.cost"
        input-type="number"
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
        @click="showConfigureDialog = true"
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
          <small>{{ (bill.paidBy && getNameById(bill.paidBy)) || 'N/A' }}</small>
        </div>
        <div v-if="bill.belongsTo.length" class="flex items-center ml-6">
          <VTooltip open-on-click location="top">
            <template #activator="{ props }">
              <VIcon v-bind="props" class="mr-2" size="x-small" icon="mdi-account-group" />
            </template>
            <div>Bill belongs to</div>
          </VTooltip>
          <small v-if="bill.belongsTo.length === peopleOptions.length">Everyone</small>
          <small v-else>
            {{ getNameById(bill.belongsTo[0]) }}
            <span v-if="bill.belongsTo.length > 1">+ {{ bill.belongsTo.length - 1 }}</span>
          </small>
        </div>
      </div>
    </VCol>

    <!-- BILL SETTINGS -->
    <VDialog
      v-model:model-value="showConfigureDialog"
      max-width="768px"
      data-vitest="bill-list-item-dialog"
    >
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
          <VBtn variant="flat" color="primary" @click="showConfigureDialog = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
