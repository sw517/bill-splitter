<script setup lang="ts">
import BillListItem from '@/components/BillListItem.vue';
import { useBillsStore } from '@/stores/bills';
import { storeToRefs } from 'pinia';

const { bills } = storeToRefs(useBillsStore());
</script>

<template>
  <VCard>
    <BillListItem
      v-for="(bill, index) in bills"
      :bill="bill"
      :placeholder="`Bill #${index + 1}`"
      class="mb-1"
    />
  </VCard>
</template>
