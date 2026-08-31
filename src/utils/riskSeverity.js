/**
 * The single owner of risk severity in the client.
 *
 * This logic used to live in three places that had quietly drifted apart:
 * `RISK_SEVERITY` in types/riskTypes.js declared four levels, the sort table in
 * SeparatedRisksView handled six, and RiskAnalysisTab kept its own normalizer
 * and its own overall-risk thresholds. Anything that reads or ranks a severity
 * now goes through here.
 */

/** Canonical severities, ordered most to least severe. */
export const SEVERITY = Object.freeze({
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM_HIGH: 'medium-high',
  MEDIUM: 'medium',
  LOW: 'low',
  EMERGING: 'emerging',
});

/**
 * Rank used for ordering. Lower sorts first (most severe at the top).
 * Kept explicit rather than derived from object order so the intent survives a
 * refactor of the enum above.
 */
const SEVERITY_RANK = Object.freeze({
  [SEVERITY.CRITICAL]: 0,
  [SEVERITY.HIGH]: 1,
  [SEVERITY.MEDIUM_HIGH]: 2,
  [SEVERITY.MEDIUM]: 3,
  [SEVERITY.LOW]: 4,
  [SEVERITY.EMERGING]: 5,
});

/**
 * Spellings observed coming back from the API, in both languages, mapped to the
 * canonical value. Anything unlisted degrades to MEDIUM so an unexpected
 * severity shows the risk rather than hiding it.
 */
const SEVERITY_ALIASES = Object.freeze({
  critical: SEVERITY.CRITICAL,
  crit: SEVERITY.CRITICAL,
  severe: SEVERITY.CRITICAL,
  critico: SEVERITY.CRITICAL,
  crítico: SEVERITY.CRITICAL,
  high: SEVERITY.HIGH,
  alto: SEVERITY.HIGH,
  alta: SEVERITY.HIGH,
  'medium-high': SEVERITY.MEDIUM_HIGH,
  medium_high: SEVERITY.MEDIUM_HIGH,
  'medio-alto': SEVERITY.MEDIUM_HIGH,
  medium: SEVERITY.MEDIUM,
  med: SEVERITY.MEDIUM,
  moderate: SEVERITY.MEDIUM,
  medio: SEVERITY.MEDIUM,
  media: SEVERITY.MEDIUM,
  low: SEVERITY.LOW,
  minor: SEVERITY.LOW,
  bajo: SEVERITY.LOW,
  baja: SEVERITY.LOW,
  emerging: SEVERITY.EMERGING,
  emergente: SEVERITY.EMERGING,
});

/** Severity used when the value is absent or unrecognised. */
export const FALLBACK_SEVERITY = SEVERITY.MEDIUM;

/**
 * Maps any severity the API might send onto a canonical value.
 *
 * @param {unknown} severity
 * @returns {string} One of SEVERITY.
 */
export function normalizeSeverity(severity) {
  const value = String(severity ?? '')
    .trim()
    .toLowerCase();

  if (!value) return FALLBACK_SEVERITY;
  return SEVERITY_ALIASES[value] ?? FALLBACK_SEVERITY;
}

/**
 * Comparator placing the most severe first. Safe to pass straight to `sort`.
 *
 * @param {{severity?: string}} a
 * @param {{severity?: string}} b
 * @returns {number}
 */
export function compareBySeverity(a, b) {
  const rankA = SEVERITY_RANK[normalizeSeverity(a?.severity)];
  const rankB = SEVERITY_RANK[normalizeSeverity(b?.severity)];
  return rankA - rankB;
}

/**
 * Counts risks per canonical severity.
 *
 * @param {Array<{severity?: string}>} risks
 * @returns {Record<string, number>} A count for every severity, zero included.
 */
export function summarizeSeverities(risks = []) {
  const counts = Object.fromEntries(Object.values(SEVERITY).map((level) => [level, 0]));

  for (const risk of risks) {
    counts[normalizeSeverity(risk?.severity)] += 1;
  }

  return counts;
}

/** Overall assessment levels, from the project's point of view. */
export const OVERALL_RISK = Object.freeze({
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
});

/**
 * Thresholds that turn a per-severity tally into one headline level.
 *
 * These are a client-side presentation rule, not a value the API returns — worth
 * knowing when comparing this figure against anything the server reports.
 * Evaluated in order; the first match wins.
 */
const OVERALL_RULES = Object.freeze([
  { level: OVERALL_RISK.CRITICAL, when: (c) => c[SEVERITY.CRITICAL] > 0 },
  { level: OVERALL_RISK.HIGH, when: (c) => c[SEVERITY.HIGH] > 2 },
  { level: OVERALL_RISK.MEDIUM, when: (c) => c[SEVERITY.HIGH] > 0 },
]);

/**
 * Headline risk level for a set of risks.
 *
 * @param {Array<{severity?: string}>} risks
 * @returns {string} One of OVERALL_RISK.
 */
export function deriveOverallRisk(risks = []) {
  const counts = summarizeSeverities(risks);
  return OVERALL_RULES.find((rule) => rule.when(counts))?.level ?? OVERALL_RISK.LOW;
}
