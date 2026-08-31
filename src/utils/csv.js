/**
 * RFC 4180 CSV serialization.
 *
 * The previous inline version wrapped every cell in quotes but escaped nothing,
 * and swapped commas for semicolons to dodge the delimiter. A description
 * containing a double quote therefore closed its own field and shifted the rest
 * of the row, and every legitimate comma in the data was silently rewritten.
 * Doubling the quotes handles both, and leaves the text intact.
 */

/**
 * Escapes one value into a CSV field.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeCsvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Serializes a header row plus data rows into CSV text.
 *
 * @param {string[]} headers
 * @param {Array<Array<unknown>>} rows
 * @returns {string}
 */
export function toCsv(headers, rows) {
  return [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\r\n');
}
