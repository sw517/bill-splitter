<script setup lang="ts">
import BillListItem from '@/components/BillListItem.vue';
import { useBillsStore } from '@/stores/bills';

const billsStore = useBillsStore();
const bills = billsStore.bills;
const addBill = billsStore.addBill;
</script>

<template>
  <VCard title="Bills">
    <VContainer>
      <BillListItem v-for="(bill, index) in bills" :bill="bill" :index="index" class="mb-1" />
      <VRow dense>
        <VCol />
        <VCol cols="auto">
          <VBtn flat color="primary" prepend-icon="mdi-plus" @click="addBill"> Add bill </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VCard>
</template>
