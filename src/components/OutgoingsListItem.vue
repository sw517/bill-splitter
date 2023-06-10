<script setup lang="ts">
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { storeToRefs } from 'pinia';
import type { Bill } from '@/types/Bill';
import { computed } from 'vue';

const props = defineProps<{
  person: Person;
}>();

const billsStore = useBillsStore();
const peopleStore = usePeopleStore();
const getPersonById = peopleStore.getPersonById;

const totalOutgoing = computed(() =>
  billsStore.billsMonthly.reduce((acc: number, bill: Bill) => {
    if (bill.paidBy === props.person.id) {
      return acc + bill.cost;
    } else {
      return acc;
    }
  }, 0)
);

const { debtsByPersonId } = storeToRefs(billsStore);
const individualsDebts = computed(() => {
  return debtsByPersonId.value[props.person.id];
});

const getNameById = (id: Person['id']) => {
  const foundPerson = getPersonById(id);
  return foundPerson?.name || foundPerson?.fallbackName;
};
</script>

<template>
  <div>
    <VTextField :label="person.fallbackName" :model-value="person.name" readonly />
    <VTextField label="Total outgoing" :model-value="totalOutgoing" readonly />
    <template v-if="individualsDebts">
      <VTextField
        v-for="personId in Object.keys(individualsDebts)"
        :key="personId"
        :label="`Amount owed to ${getNameById(personId)}`"
        :model-value="individualsDebts[personId as keyof typeof individualsDebts]"
        readonly
      />
    </template>
  </div>
</template>
