import { computed } from 'vue';
<script setup lang="ts">
import { usePeopleStore } from '@/stores/people';
import { computed } from 'vue';
import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';

const generalStore = useGeneralStore();
const billsStore = useBillsStore();
const peopleStore = usePeopleStore();

const debts = computed(() => {
  if (!billsStore.allDebtsByPersonId) return [];

  return Object.entries(billsStore.allDebtsByPersonId).reduce(
    (acc: any, [debtorId, debtsStructure]) => {
      const debtor = peopleStore.getNameById(debtorId);
      const debtorDebts = Object.entries(debtsStructure).reduce(
        (nestedAcc: any, [creditorId, amount]) => {
          const creditor = peopleStore.getNameById(creditorId);
          const roundedAmount = Math.ceil(amount * 100) / 100;
          return [
            ...nestedAcc,
            {
              debtor,
              creditor,
              amount: roundedAmount,
            },
          ];
        },
        []
      );
      return [...acc, ...debtorDebts];
    },
    []
  );
});
</script>

<template>
  <VCard title="Payments">
    <VCardText>
      <template v-if="debts?.length">
        <div v-for="debt in debts" class="flex items-baseline mb-2">
          <VChip class="mr-1">{{ debt.debtor }}</VChip>
          <span>owes</span>
          <VChip class="mx-1">{{ debt.creditor }}</VChip>
          <VIcon size="sm" :icon="generalStore.currencyIcon" />
          <span>{{ debt.amount }}</span>
        </div>
      </template>
      <template v-else>
        <p>Add some bills to view expected payments...</p>
      </template>
    </VCardText>
  </VCard>
</template>
