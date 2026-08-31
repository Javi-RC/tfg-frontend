import {
  SEVERITY,
  OVERALL_RISK,
  FALLBACK_SEVERITY,
  normalizeSeverity,
  compareBySeverity,
  summarizeSeverities,
  deriveOverallRisk,
} from './riskSeverity';

const risk = (severity) => ({ severity });

describe('normalizeSeverity', () => {
  it('passes canonical values through', () => {
    expect(normalizeSeverity('critical')).toBe(SEVERITY.CRITICAL);
    expect(normalizeSeverity('high')).toBe(SEVERITY.HIGH);
    expect(normalizeSeverity('medium-high')).toBe(SEVERITY.MEDIUM_HIGH);
    expect(normalizeSeverity('medium')).toBe(SEVERITY.MEDIUM);
    expect(normalizeSeverity('low')).toBe(SEVERITY.LOW);
    expect(normalizeSeverity('emerging')).toBe(SEVERITY.EMERGING);
  });

  it('accepts the Spanish spellings the API also returns', () => {
    expect(normalizeSeverity('alto')).toBe(SEVERITY.HIGH);
    expect(normalizeSeverity('alta')).toBe(SEVERITY.HIGH);
    expect(normalizeSeverity('media')).toBe(SEVERITY.MEDIUM);
    expect(normalizeSeverity('baja')).toBe(SEVERITY.LOW);
    expect(normalizeSeverity('emergente')).toBe(SEVERITY.EMERGING);
  });

  it('ignores casing and surrounding whitespace', () => {
    expect(normalizeSeverity('  CRITICAL ')).toBe(SEVERITY.CRITICAL);
    expect(normalizeSeverity('High')).toBe(SEVERITY.HIGH);
  });

  it('accepts the abbreviations seen in legacy payloads', () => {
    expect(normalizeSeverity('crit')).toBe(SEVERITY.CRITICAL);
    expect(normalizeSeverity('severe')).toBe(SEVERITY.CRITICAL);
    expect(normalizeSeverity('med')).toBe(SEVERITY.MEDIUM);
    expect(normalizeSeverity('moderate')).toBe(SEVERITY.MEDIUM);
    expect(normalizeSeverity('minor')).toBe(SEVERITY.LOW);
  });

  it('degrades anything unrecognised to the fallback rather than dropping it', () => {
    expect(normalizeSeverity('catastrophic')).toBe(FALLBACK_SEVERITY);
    expect(normalizeSeverity('')).toBe(FALLBACK_SEVERITY);
    expect(normalizeSeverity(null)).toBe(FALLBACK_SEVERITY);
    expect(normalizeSeverity(undefined)).toBe(FALLBACK_SEVERITY);
    expect(normalizeSeverity(42)).toBe(FALLBACK_SEVERITY);
  });
});

describe('compareBySeverity', () => {
  it('orders most severe first', () => {
    const sorted = [
      risk('low'),
      risk('critical'),
      risk('medium'),
      risk('high'),
      risk('emerging'),
      risk('medium-high'),
    ]
      .sort(compareBySeverity)
      .map((r) => r.severity);

    expect(sorted).toEqual(['critical', 'high', 'medium-high', 'medium', 'low', 'emerging']);
  });

  it('ranks unknown severities alongside medium', () => {
    expect(compareBySeverity(risk('nonsense'), risk('medium'))).toBe(0);
  });

  it('ranks a missing severity alongside medium', () => {
    expect(compareBySeverity({}, risk('medium'))).toBe(0);
  });
});

describe('summarizeSeverities', () => {
  it('counts each canonical severity', () => {
    const counts = summarizeSeverities([
      risk('critical'),
      risk('high'),
      risk('high'),
      risk('baja'),
    ]);

    expect(counts[SEVERITY.CRITICAL]).toBe(1);
    expect(counts[SEVERITY.HIGH]).toBe(2);
    expect(counts[SEVERITY.LOW]).toBe(1);
  });

  it('reports zero for severities that are absent', () => {
    const counts = summarizeSeverities([risk('low')]);

    expect(counts[SEVERITY.CRITICAL]).toBe(0);
    expect(counts[SEVERITY.EMERGING]).toBe(0);
  });

  it('returns an all-zero tally for an empty list', () => {
    const counts = summarizeSeverities([]);

    expect(Object.values(counts).every((n) => n === 0)).toBe(true);
  });

  it('defaults to no argument safely', () => {
    expect(() => summarizeSeverities()).not.toThrow();
  });
});

describe('deriveOverallRisk', () => {
  it('is CRITICAL when at least one critical risk exists', () => {
    expect(deriveOverallRisk([risk('critical'), risk('low')])).toBe(OVERALL_RISK.CRITICAL);
  });

  it('is HIGH above three high risks', () => {
    expect(deriveOverallRisk([risk('high'), risk('high'), risk('high')])).toBe(OVERALL_RISK.HIGH);
  });

  it('is MEDIUM at one to two high risks', () => {
    expect(deriveOverallRisk([risk('high')])).toBe(OVERALL_RISK.MEDIUM);
    expect(deriveOverallRisk([risk('high'), risk('high')])).toBe(OVERALL_RISK.MEDIUM);
  });

  it('is LOW with no high or critical risks', () => {
    expect(deriveOverallRisk([risk('low'), risk('medium')])).toBe(OVERALL_RISK.LOW);
  });

  it('is LOW for an empty list', () => {
    expect(deriveOverallRisk([])).toBe(OVERALL_RISK.LOW);
  });

  it('lets a critical risk win over any number of high ones', () => {
    expect(
      deriveOverallRisk([risk('high'), risk('high'), risk('high'), risk('critical')])
    ).toBe(OVERALL_RISK.CRITICAL);
  });
});
