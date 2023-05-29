<script setup lang="ts">
import BillListItem from '@/components/BillListItem.vue';
import { useBillsStore } from '@/stores/bills';

const billsStore = useBillsStore();
const bills = billsStore.bills;
const addBill = billsStore.addBill;
</script>

<template>
  <VCard title="Bills">
    <BillListItem
      v-for="(bill, index) in bills"
      :bill="bill"
      :placeholder="`Bill #${index + 1}`"
      class="mb-1"
    />
    <VBtn prepend-icon="mdi-plus" @click="addBill">Add bill</VBtn>
  </VCard>
</template>
