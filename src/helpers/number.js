import { countBy, isEmpty } from "lodash";

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

export function getRatingOccurrences(ratings) {
  if (isEmpty(ratings)) return [];

  const occurrences = countBy(ratings, (r) => r);
  return Object.values(occurrences);
}

export function getAverageRatings(ratings) {
  if (isEmpty(ratings)) return 0;

  const occurrences = getRatingOccurrences(ratings);

  let average = 0;
  for (let i = 0; i < occurrences.length; i++) {
    const rateElement = occurrences[i];
    average += rateElement * (i + 1);
  }

  const total = Math.round(occurrences.reduce((prev, curr) => prev + curr, 0));

  return average / total;
}
