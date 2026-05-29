export const getStockAvailabilityLabel = (stock) => {
  const value = Number(stock);
  if (!Number.isFinite(value) || value <= 0) {
    return 'Currently unavailable — out of stock';
  }
  if (value === 1) {
    return 'In stock — 1 unit available';
  }
  return `In stock — ${value} units available`;
};

export const isOutOfStock = (stock) => {
  const value = Number(stock);
  return !Number.isFinite(value) || value <= 0;
};
