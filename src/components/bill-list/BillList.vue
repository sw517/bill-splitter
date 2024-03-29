<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { type Bill } from '@/types/Bill';
import BillListItem from '@/components/bill-list/BillListItem.vue';
import BillSettingsDialog from '@/components/bill-list/BillSettingsDialog.vue';
import billAutocompleteItems from '@/assets/data/bill-autocomplete-items';

import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';

const peopleStore = usePeopleStore();
const billsStore = useBillsStore();
const { currencyIcon } = useGeneralStore();

const { people } = storeToRefs(peopleStore);
const billSelected: Ref<Bill | undefined> = ref();
const showConfigureDialog: Ref<boolean> = ref(false);
const hasAddedNewBill: Ref<boolean> = ref(false);

const onBillSettingsClick = (bill: Bill) => {
  billSelected.value = bill;
  showConfigureDialog.value = true;
};

const handleAddBill = () => {
  billsStore.addBill();
  hasAddedNewBill.value = true;
};

const autofocus = (index: number) => {
  return hasAddedNewBill.value && index === billsStore.bills.length - 1;
};
</script>

<template>
  <VCard title="Bills">
    <VCardText>
      <template v-for="(bill, index) in billsStore.bills" :key="bill.id">
        <VDivider v-if="index !== 0" class="mb-4 v-divider--xxs-only" />
        <BillListItem
          :bill="bill"
          :index="index"
          :currency-icon="currencyIcon"
          :people="people"
          :description-autocomplete-items="billAutocompleteItems"
          class="mb-3"
          :autofocus="autofocus(index)"
          @settings-click="onBillSettingsClick"
        />
      </template>
    </VCardText>
    <VCardActions>
      <VBtn prepend-icon="mdi-plus" @click="handleAddBill"> Add bill </VBtn>
    </VCardActions>
  </VCard>
  <BillSettingsDialog
    v-if="billSelected"
    v-model:model-value="showConfigureDialog"
    :bill="billSelected"
    :currency-icon="currencyIcon"
    :people="people"
  />
</template>
