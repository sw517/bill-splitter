<script setup lang="ts">
import { BillFrequency, type Bill } from '@/types/Bill';
import { useBillsStore } from '@/stores/bills';
import { usePeopleStore } from '@/stores/people';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const props = defineProps<{
  bill: Bill;
  placeholder: string;
}>();

const billsStore = useBillsStore();
const { people } = storeToRefs(usePeopleStore());

const onInput = <Key extends keyof Bill>(input: Bill[Key], field: Key) => {
  billsStore.editBill(props.bill.id, field, input);
};

const billFrequencyOptions = (Object.keys(BillFrequency) as Array<keyof typeof BillFrequency>).map(
  (key) => {
    return {
      title: key,
      value: BillFrequency[key],
    };
  }
);

const peopleOptions = computed(() =>
  people.value.map((person, index) => ({
    title: person.name || `Person #${index + 1}`,
    value: person.id,
  }))
);
</script>

<template>
  <div>
    <VTextField
      :label="placeholder"
      :model-value="bill.name"
      @update:modelValue="onInput($event, 'name')"
    />
    <VTextField
      label="Cost"
      :model-value="bill.cost"
      type="number"
      @update:modelValue="onInput(Number($event), 'cost')"
    />
    <VSelect
      label="Frequency"
      :model-value="bill.frequency"
      :items="billFrequencyOptions"
      @update:modelValue="onInput($event, 'frequency')"
    />
    <!-- Todo: Change input text to show 'Everyone' if all are selected -->
    <VSelect
      label="Belongs to"
      :model-value="bill.belongsTo"
      :items="peopleOptions"
      multiple
      @update:modelValue="onInput($event, 'belongsTo')"
    />
    <!-- Todo: Change input text to show 'Everyone' if all are selected -->
    <VSelect
      label="Paid by"
      :model-value="bill.paidBy"
      :items="peopleOptions"
      multiple
      @update:modelValue="onInput($event, 'paidBy')"
    />
  </div>
</template>
