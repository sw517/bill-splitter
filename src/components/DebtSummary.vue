<script setup lang="ts">
import { computed } from 'vue';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';
import type { Person } from '@/types/Person';

const generalStore = useGeneralStore();
const billsStore = useBillsStore();
const peopleStore = usePeopleStore();

const getNameById = (id: Person['id']) => {
  const foundPerson = peopleStore.getPersonById(id);
  return foundPerson?.name || foundPerson?.fallbackName;
};

const debts = computed(() => {
  if (!billsStore.allDebtsByPersonId) return [];

  return Object.entries(billsStore.allDebtsByPersonId).reduce(
    (acc: any, [debtorId, debtsStructure]) => {
      const debtor = getNameById(debtorId);
      const debtorDebts = Object.entries(debtsStructure).reduce(
        (nestedAcc: any, [creditorId, amount]) => {
          const creditor = getNameById(creditorId);
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
      <div v-for="debt in debts" class="flex items-baseline mb-2">
        <VChip class="mr-1">{{ debt.debtor }}</VChip>
        <span>owes</span>
        <VChip class="mx-1">{{ debt.creditor }}</VChip>
        <VIcon size="sm" :icon="generalStore.currencyIcon" />
        <span>{{ debt.amount }}</span>
      </div>
    </VCardText>
  </VCard>
</template>
