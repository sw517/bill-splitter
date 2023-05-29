<script setup lang="ts">
import type { Person } from '@/types/Person';
import { usePeopleStore } from '@/stores/people';
import { useBillsStore } from '@/stores/bills';
import { storeToRefs } from 'pinia';
import type { Bill } from '@/types/Bill';
import { computed } from 'vue';

const props = defineProps<{
  person: Person;
  placeholder: string;
}>();

const { billsMonthly } = storeToRefs(useBillsStore());
const peopleStore = usePeopleStore();
const people = peopleStore.people;
const getPersonById = peopleStore.getPersonById;

const totalOutgoing = computed(() =>
  billsMonthly.value.reduce((acc: number, bill: Bill) => {
    if (bill.paidBy.includes(props.person.id)) {
      const billShare = bill.cost / bill.paidBy.length;
      return acc + billShare;
    } else {
      return acc;
    }
  }, 0)
);

const debtPerPerson = computed(() =>
  billsMonthly.value.reduce((acc: object, bill: Bill) => {
    if (bill.paidBy.includes(props.person.id) || !bill.belongsTo.includes(props.person.id)) {
      return acc;
    }
    const billShare = bill.cost / bill.belongsTo.length;
    return bill.paidBy.reduce((newAcc: object, personId: Person['id']) => {
      if (acc[personId as keyof typeof acc]) {
        return { ...acc, [personId]: acc[personId as keyof typeof acc] + billShare };
      } else {
        return { ...acc, [personId]: billShare };
      }
    }, acc);
  }, {})
);
</script>

<template>
  <div>
    <VTextField :label="placeholder" :model-value="person.name" readonly />
    <VTextField label="Total outgoing" :model-value="totalOutgoing" readonly />
    <VTextField
      v-for="personId in Object.keys(debtPerPerson)"
      :key="personId"
      :label="`Amount owed to ${getPersonById(personId)?.name}`"
      :model-value="debtPerPerson[personId as keyof typeof debtPerPerson]"
      readonly
    />
  </div>
</template>
