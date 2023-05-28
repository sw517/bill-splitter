import type { Bill } from '@/types/Bill';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useBillsStore = defineStore('bills', () => {
  const bills: Ref<Bill[]> = ref([]);

  return { bills };
});
