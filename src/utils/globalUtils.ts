/**
 * Removes anything from a string that isn't a decimal or a digit
 * @param currency
 */
export const parseCurrencyAsFloat = (currency: string) => {
  return Number(currency.replace(/[^0-9.-]+/g, ""));
}

/**
 * Converts int/float value to currency (too obvious?)
 * @param value
 */
export const convertNumberToCurrency = (value: number) => {
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(value);
}

/**
 * Returns the current date in YYYY-MM-DD string format
 */
export const currentDateYYYYMMDD = () => {
  let date = new Date();
  return date.toISOString().split('T')[0];
}

/**
 * Takes in a date millisecond value and converts to to Month Day Year format
 * @param dateInt
 */
export const makeDateNowReadable = (dateInt) => {
  let date = new Date(dateInt);
  if (date) {
    let month = date.toLocaleString('default', {month: 'long'});
    let day = date.getDate();
    let year = date.getFullYear();
    return `${month} ${day} ${year}`;
  } else {
    return null;
  }
}

/**
 * Truncates a string at a given character index
 * @param str
 * @param n
 * @param boundary
 */
export const truncateString = (str, n, boundary?) => {
  if (str.length <= n) {
    return str;
  }
  const subString = str.substring(0, n - 1); // the original check
  return (boundary ? subString.substring(0, subString.lastIndexOf(" ")) : subString) + "...";
}