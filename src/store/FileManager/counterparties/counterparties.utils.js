const normalizeId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : value;
};

const normalizeText = (value) => String(value ?? '').trim();

const normalizeNullableText = (value) => {
  const text = normalizeText(value);
  return text || null;
};

// Convert the API resource into the camelCase shape used by finance screens.
export const normalizeFinancialCounterparty = (counterparty) => ({
  id: normalizeId(counterparty?.id),
  companyId: normalizeId(counterparty?.company_id ?? null),
  fullName: normalizeText(counterparty?.full_name),
  cardNumber: normalizeNullableText(counterparty?.card_number),
  iban: normalizeNullableText(counterparty?.iban),
  account: normalizeNullableText(counterparty?.account),
  bankName: normalizeNullableText(counterparty?.bank_name),
  createdAt: counterparty?.created_at ?? null,
  updatedAt: counterparty?.updated_at ?? null,
});

// Keep Laravel pagination metadata intact for the shared pagination component.
export const normalizeFinancialCounterpartiesResponse = (payload) => {
  const root = payload && typeof payload === 'object' ? payload : {};
  const data = Array.isArray(root?.data) ? root.data : [];

  return {
    counterparties: data.map(normalizeFinancialCounterparty),
    links: root?.links ?? null,
    meta: root?.meta ?? null,
    total: Number(root?.total ?? root?.meta?.total ?? data.length ?? 0) || 0,
  };
};
