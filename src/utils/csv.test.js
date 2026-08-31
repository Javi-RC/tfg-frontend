import { escapeCsvCell, toCsv } from './csv';

describe('escapeCsvCell', () => {
  it('wraps a plain value in quotes', () => {
    expect(escapeCsvCell('hello')).toBe('"hello"');
  });

  it('preserves commas instead of rewriting them', () => {
    // The old implementation replaced these with semicolons, corrupting the data.
    expect(escapeCsvCell('delays, then overruns')).toBe('"delays, then overruns"');
  });

  it('doubles embedded quotes so the field cannot close early', () => {
    expect(escapeCsvCell('the "critical" path')).toBe('"the ""critical"" path"');
  });

  it('keeps newlines inside the quoted field', () => {
    expect(escapeCsvCell('line one\nline two')).toBe('"line one\nline two"');
  });

  it('renders null and undefined as an empty field', () => {
    expect(escapeCsvCell(null)).toBe('""');
    expect(escapeCsvCell(undefined)).toBe('""');
  });

  it('renders numbers and booleans as text', () => {
    expect(escapeCsvCell(0)).toBe('"0"');
    expect(escapeCsvCell(false)).toBe('"false"');
  });
});

describe('toCsv', () => {
  it('emits a header row followed by data rows', () => {
    expect(toCsv(['name', 'severity'], [['Scope creep', 'high']])).toBe(
      '"name","severity"\r\n"Scope creep","high"'
    );
  });

  it('keeps rows aligned when a cell contains a comma and a quote', () => {
    const csv = toCsv(
      ['name', 'description'],
      [['Skill gap', 'React, Node — the "hard" parts']]
    );

    const [, dataRow] = csv.split('\r\n');
    expect(dataRow).toBe('"Skill gap","React, Node — the ""hard"" parts"');
  });

  it('handles an empty row set', () => {
    expect(toCsv(['a', 'b'], [])).toBe('"a","b"');
  });
});
