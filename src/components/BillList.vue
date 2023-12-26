<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { type Bill } from '@/types/Bill';
import BillListItem from '@/components/BillListItem.vue';
import BillSettingsDialog from '@/components/BillSettingsDialog.vue';
import billAutocompleteItems from '@/assets/data/bill-autocomplete-items';

import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';
import { usePeopleStore } from '@/stores/people';

const billsStore = useBillsStore();
const { people } = usePeopleStore();
const { currencyIcon } = useGeneralStore();

const billSelected: Ref<Bill | undefined> = ref();
const showConfigureDialog: Ref<boolean> = ref(false);

const onBillSettingsClick = (bill: Bill) => {
  billSelected.value = bill;
  showConfigureDialog.value = true;
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
          @settings-click="onBillSettingsClick"
        />
      </template>
    </VCardText>
    <VCardActions>
      <VBtn prepend-icon="mdi-plus" @click="billsStore.addBill"> Add bill </VBtn>
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
