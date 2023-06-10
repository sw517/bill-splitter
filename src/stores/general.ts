import { defineStore } from 'pinia';
import { type Ref, ref, computed } from 'vue';
import { Currency, CurrencyIcon } from '@/types/General';

export const useGeneralStore = defineStore('general', () => {
  const currency: Ref<Currency | null> = ref(Currency.GBP);

  const currencyIcon = computed(() => {
    return currency.value ? CurrencyIcon[currency.value] : '';
  });
  return { currency, currencyIcon };
});
