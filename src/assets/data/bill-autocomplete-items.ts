type BillAutoCompleteItemDivider = {
  divider: boolean;
};

type BillAutoCompleteItemHeader = {
  header: string;
  value: string;
};

type BillAutoCompleteItem = {
  group: string;
  value: string;
};

const billAutocompleteItems: (
  | BillAutoCompleteItemDivider
  | BillAutoCompleteItemHeader
  | BillAutoCompleteItem
)[] = [
  // { header: 'Housing', value: 'Housing' },
  { group: 'Housing', value: 'Rent/Mortgage' },
  { group: 'Housing', value: 'Property taxes' },
  { group: 'Housing', value: 'Home maintenance' },
  { group: 'Housing', value: 'Homeowners association (HOA) fees' },
  { group: 'Housing', value: 'Home improvements' },
  { group: 'Housing', value: 'Furniture/appliance repairs' },
  { group: 'Housing', value: 'Furniture upgrades' },
  { group: 'Housing', value: 'Emergency home repairs' },

  // { divider: true },
  // { header: 'Utilities', value: 'Utilities' },
  { group: 'Utilities', value: 'Electricity' },
  { group: 'Utilities', value: 'Water' },
  { group: 'Utilities', value: 'Gas' },
  { group: 'Utilities', value: 'Internet/Cable' },

  // { divider: true },
  // { header: 'Communication', value: 'Communication' },
  { group: 'Communication', value: 'Phone bill' },

  // { divider: true },
  // { header: 'Groceries', value: 'Groceries' },
  { group: 'Groceries', value: 'Groceries' },

  // { divider: true },
  // { header: 'Dining', value: 'Dining' },
  { group: 'Dining', value: 'Dining out' },

  // { divider: true },
  // { header: 'Transportation', value: 'Transportation' },
  { group: 'Transportation', value: 'Fuel' },
  { group: 'Transportation', value: 'Public transit' },
  { group: 'Transportation', value: 'Car payment' },
  { group: 'Transportation', value: 'Car insurance' },
  { group: 'Transportation', value: 'Auto maintenance' },
  { group: 'Transportation', value: 'Parking fees' },
  { group: 'Transportation', value: 'Car registration' },
  { group: 'Transportation', value: 'Parking permits' },

  // { divider: true },
  // { header: 'Insurance', value: 'Insurance' },
  { group: 'Insurance', value: 'Health insurance premiums' },
  { group: 'Insurance', value: 'Life insurance premiums' },
  { group: 'Insurance', value: 'Home insurance' },
  { group: 'Insurance', value: 'Auto insurance' },
  { group: 'Insurance', value: 'Pet insurance' },
  { group: 'Insurance', value: 'Electronics insurance' },

  // { divider: true },
  // { header: 'Children', value: 'Children' },
  { group: 'Children', value: 'Childcare' },
  { group: 'Children', value: 'Diapers/baby supplies' },
  { group: 'Children', value: 'Educational toys/games' },

  // { divider: true },
  // { header: 'Education', value: 'Education' },
  { group: 'Education', value: 'Tuition' },
  { group: 'Education', value: 'Books' },
  { group: 'Education', value: 'School supplies' },

  // { divider: true },
  // { header: 'Entertainment', value: 'Entertainment' },
  { group: 'Entertainment', value: 'Subscriptions (Netflix, Spotify, etc.)' },
  { group: 'Entertainment', value: 'Hobbies' },
  { group: 'Entertainment', value: 'Entertainment' },
  { group: 'Entertainment', value: 'Movies' },
  { group: 'Entertainment', value: 'Music' },
  { group: 'Entertainment', value: 'Books' },
  { group: 'Entertainment', value: 'Museum memberships' },

  // { divider: true },
  // { header: 'Health', value: 'Health' },
  { group: 'Health', value: 'Healthcare expenses' },
  { group: 'Health', value: 'Prescription medications' },
  { group: 'Health', value: 'Vision care' },
  { group: 'Health', value: 'Dental care expenses' },
  { group: 'Health', value: 'Medical tests/screenings' },

  // { divider: true },
  // { header: 'Personal Care', value: 'Personal Care' },
  { group: 'Personal Care', value: 'Haircuts' },
  { group: 'Personal Care', value: 'Toiletries' },
  { group: 'Personal Care', value: 'Spa/massage expenses' },
  { group: 'Personal Care', value: 'Dry cleaning' },

  // { divider: true },
  // { header: 'Savings', value: 'Savings' },
  { group: 'Savings', value: 'Emergency fund savings' },
  { group: 'Savings', value: 'Retirement savings' },
  { group: 'Savings', value: 'Investments' },
  { group: 'Savings', value: 'Miscellaneous savings' },
  { group: 'Savings', value: 'College savings fund' },

  // { divider: true },
  // { header: 'Debts', value: 'Debts' },
  { group: 'Debts', value: 'Loan payments (personal loans, student loans)' },
  { group: 'Debts', value: 'Credit card payments' },
  { group: 'Debts', value: 'Student loan payments' },
  { group: 'Debts', value: 'Alimony/child support' },
  { group: 'Debts', value: 'Car loan payments' },

  // { divider: true },
  // { header: 'Taxes', value: 'Taxes' },
  { group: 'Taxes', value: 'Income tax' },
  { group: 'Taxes', value: 'Property tax' },
  { group: 'Taxes', value: 'Council tax' },

  // { divider: true },
  // { header: 'Charitable Contributions', value: 'Charitable Contributions' },
  { group: 'Charitable Contributions', value: 'Charitable donations' },

  // { divider: true },
  // { header: 'Subscriptions/Memberships', value: 'Subscriptions/Memberships' },
  { group: 'Subscriptions/Memberships', value: 'Gym membership' },
  { group: 'Subscriptions/Memberships', value: 'Subscriptions to newspapers/magazines' },
  { group: 'Subscriptions/Memberships', value: 'Professional association dues' },
  { group: 'Subscriptions/Memberships', value: 'Software subscriptions' },
  { group: 'Subscriptions/Memberships', value: 'Music lessons' },
  { group: 'Subscriptions/Memberships', value: 'Language classes' },
  { group: 'Subscriptions/Memberships', value: 'Cooking classes' },
  { group: 'Subscriptions/Memberships', value: 'Conference fees' },

  // { divider: true },
  // { header: 'Miscellaneous', value: 'Miscellaneous' },
  { group: 'Miscellaneous', value: 'Gifts' },

  // { divider: true },
  // { header: 'Miscellaneous', value: 'Miscellaneous' },
  { group: 'Miscellaneous', value: 'Gifts' },
  { group: 'Miscellaneous', value: 'Clothing' },
  { group: 'Miscellaneous', value: 'Personal care' },
  { group: 'Miscellaneous', value: 'Coffee/tea expenses' },
  { group: 'Miscellaneous', value: 'Alcohol/tobacco expenses' },
  { group: 'Miscellaneous', value: 'Miscellaneous expenses' },
  { group: 'Miscellaneous', value: 'Public services (trash collection)' },
  { group: 'Miscellaneous', value: 'Banking fees' },
  { group: 'Miscellaneous', value: 'Mobile app purchases' },
  { group: 'Miscellaneous', value: 'Outdoor equipment (bikes, scooters)' },
  { group: 'Miscellaneous', value: 'Sports equipment' },
  { group: 'Miscellaneous', value: 'Public parking fees' },
  { group: 'Miscellaneous', value: 'Photography equipment' },
  { group: 'Miscellaneous', value: 'Art supplies' },
  { group: 'Miscellaneous', value: 'Work-related expenses' },
  { group: 'Miscellaneous', value: 'Coffee/tea expenses' },
];

export default billAutocompleteItems;
