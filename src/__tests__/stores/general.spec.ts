import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGeneralStore } from '@/stores/general';
import { Currency, CurrencyIcon } from '@/types/General';

describe('Store: general', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('sets a default currency', () => {
    const generalStore = useGeneralStore();
    expect(generalStore.currency).toEqual(Currency.GBP);
  });

  it('returns the correct currency icon based on currency', () => {
    const generalStore = useGeneralStore();
    generalStore.$patch({ currency: Currency.GBP });
    expect(generalStore.currencyIcon).toEqual(CurrencyIcon[Currency.GBP]);

    generalStore.$patch({ currency: Currency.EURO });
    expect(generalStore.currencyIcon).toEqual(CurrencyIcon[Currency.EURO]);

    generalStore.$patch({ currency: Currency.USD });
    expect(generalStore.currencyIcon).toEqual(CurrencyIcon[Currency.USD]);
  });

  it('toggles autosave', () => {
    const generalStore = useGeneralStore();
    expect(generalStore.autosave).toBe(false);
    generalStore.toggleAutosave();
    expect(generalStore.autosave).toBe(true);
    generalStore.toggleAutosave();
    expect(generalStore.autosave).toBe(false);
  });

  it('resets the store', () => {
    const generalStore = useGeneralStore();
    generalStore.$patch({
      currency: Currency.EURO,
      autosave: true,
    });

    generalStore.$reset();
    expect(generalStore.currency).toEqual(Currency.GBP);
    expect(generalStore.autosave).toBe(false);
  });
});
