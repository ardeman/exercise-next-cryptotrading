export const currencyFormatter = (amount, options) => {
  if (!options) {
    options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  }

  return amount?.toLocaleString("en-US", options);
};
