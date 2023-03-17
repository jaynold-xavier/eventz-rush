// Create our number formatter.
const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "INR",

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
});

export function formatAsCurrency(number) {
  if (isNaN(number)) return 0;

  const currString = currencyFormatter.format(number);
  return currString.substring(0, 1) + " " + currString.substring(1);
}
