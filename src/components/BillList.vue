<script setup lang="ts">
import BillListItem from '@/components/BillListItem.vue';
import billAutocompleteItems from '@/assets/data/bill-autocomplete-items';

import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';
import { usePeopleStore } from '@/stores/people';

const billsStore = useBillsStore();
const { people } = usePeopleStore();
const { currencyIcon } = useGeneralStore();
const bills = billsStore.bills;
const addBill = billsStore.addBill;
</script>

<template>
  <VCard title="Bills">
    <VCardText>
      <template v-for="(bill, index) in bills" :key="bill.id">
        <VDivider v-if="index !== 0" class="mb-4 v-divider--xxs-only" />
        <BillListItem
          :bill="bill"
          :index="index"
          :currency-icon="currencyIcon"
          :people="people"
          :description-autocomplete-items="billAutocompleteItems"
          class="mb-3"
        />
      </template>
    </VCardText>
    <VCardActions>
      <VBtn prepend-icon="mdi-plus" @click="addBill"> Add bill </VBtn>
    </VCardActions>
  </VCard>
</template>
