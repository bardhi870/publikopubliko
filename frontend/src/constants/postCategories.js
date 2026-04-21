export const CATEGORY_OPTIONS = [
  { value: "lajme", label: "Lajme" },
  { value: "vendi", label: "Vendi" },
  { value: "rajoni", label: "Rajoni" },
  { value: "bota", label: "Bota" },
  { value: "patundshmeri", label: "Patundshmëri" },
  { value: "automjete", label: "Automjete" },
  { value: "konkurse-pune", label: "Konkurse Pune" }
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_OPTIONS.map(({ value, label }) => [value, label])
);