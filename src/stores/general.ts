import { defineStore } from 'pinia';
import { type Ref, ref, computed } from 'vue';
import { Currency, CurrencyIcon } from '@/types/General';

export const useGeneralStore = defineStore('general', () => {
  const currency: Ref<Currency | null> = ref(Currency.GBP);
  const autosave: Ref<boolean> = ref(false);

  const currencyIcon = computed(() => {
    return currency.value ? CurrencyIcon[currency.value] : '';
  });

  function toggleAutosave(): void {
    autosave.value = !autosave.value;
  }

  function $reset() {
    currency.value = Currency.GBP;
    autosave.value = false;
  }

  return { $reset, currency, currencyIcon, toggleAutosave, autosave };
});
