<script setup lang="ts">
import { BillFrequency, type Bill } from '@/types/Bill';
import { useBillsStore } from '@/stores/bills';
import { usePeopleStore } from '@/stores/people';
import { useGeneralStore } from '@/stores/general';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = defineProps<{
  bill: Bill;
  index: number;
}>();

const billsStore = useBillsStore();
const { currencyIcon } = storeToRefs(useGeneralStore());
const { people } = storeToRefs(usePeopleStore());
const dialogOpen = ref(false);

const onInput = <Key extends keyof Bill>(input: Bill[Key], field: Key) => {
  billsStore.editBill(props.bill.id, field, input);
};

const billFrequencyOptions = (Object.keys(BillFrequency) as Array<keyof typeof BillFrequency>).map(
  (key) => BillFrequency[key]
);

const peopleOptions = computed(() =>
  people.value.map((person) => ({
    title: person.name || person.fallbackName,
    value: person.id,
  }))
);
</script>

<template>
  <VRow class="d-flex align-center" dense>
    <!-- Todo: Show if bill is unaccounted for if a person is deleted -->
    <VCol cols="6">
      <VTextField
        label="Bill description"
        :model-value="bill.name"
        hide-details
        @update:modelValue="onInput($event, 'name')"
      />
    </VCol>
    <VCol>
      <VTextField
        label="Cost"
        :model-value="bill.cost"
        type="number"
        hide-details
        @update:modelValue="onInput(Number($event), 'cost')"
      >
        <template #prepend-inner>
          <VIcon size="x-small" :icon="currencyIcon" />
        </template>
      </VTextField>
    </VCol>
    <VCol cols="2" sm="1" class="text-right">
      <VBtn
        icon="mdi-cog"
        title="Configure"
        color="primary"
        flat
        size="x-small"
        @click="dialogOpen = true"
      />
    </VCol>
    <VDialog v-model:model-value="dialogOpen">
      <VCard>
        <VCardTitle class="d-flex justify-between">
          <span>
            {{ bill.name || 'Unnamed bill' }}
          </span>
          <span class="d-inline-flex items-baseline">
            <VIcon :icon="currencyIcon" size="x-small" />
            {{ bill.cost }}
          </span>
        </VCardTitle>
        <VCardText>
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
          <VSelect
            label="Paid by"
            :model-value="bill.paidBy"
            :items="peopleOptions"
            @update:modelValue="onInput($event, 'paidBy')"
          />
        </VCardText>
        <VCardActions class="d-flex justify-between">
          <VBtn variant="flat" color="error">Remove bill</VBtn>
          <VBtn color="accent" @click="dialogOpen = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
