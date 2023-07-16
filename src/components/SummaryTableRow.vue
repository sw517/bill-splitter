<script setup lang="ts">
import type { Person } from '@/types/Person';
import { useBillsStore } from '@/stores/bills';
import { useGeneralStore } from '@/stores/general';
import type { Bill } from '@/types/Bill';
import { computed } from 'vue';

const props = defineProps<{
  person: Person;
}>();

const billsStore = useBillsStore();
const generalStore = useGeneralStore();

const totalOutgoing = computed(() => {
  const total = billsStore.billsMonthly.reduce((acc: number, bill: Bill) => {
    if (bill.paidBy === props.person.id) {
      return acc + bill.cost;
    } else {
      return acc;
    }
  }, 0);

  // Return total to 2 decimal places
  return Math.ceil(total * 100) / 100;
});

const totalOwed = computed(() => {
  if (!billsStore.allDebtsByPersonId) return 0;

  const total = Object.entries(billsStore.allDebtsByPersonId).reduce(
    (acc: number, [personId, debtsStructure]) => {
      if (personId === props.person.id) {
        return acc;
      } else {
        return (
          acc +
          Object.entries(debtsStructure).reduce((acc: number, [debtorId, amount]) => {
            if (debtorId === props.person.id) {
              return acc + amount;
            } else {
              return acc;
            }
          }, 0)
        );
      }
    },
    0
  );

  // Return total to 2 decimal places
  return Math.ceil(total * 100) / 100;
});
</script>

<template>
  <tr>
    <td>{{ person.name || person.fallbackName }}</td>
    <td>
      <span class="flex items-baseline">
        <VIcon :icon="generalStore.currencyIcon" size="sm" />
        <span>{{ totalOutgoing }}</span>
      </span>
    </td>
    <td>
      <span class="flex items-baseline">
        <VIcon :icon="generalStore.currencyIcon" size="sm" />
        <span>{{ totalOwed }}</span>
      </span>
    </td>
  </tr>
</template>
