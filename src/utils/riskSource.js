/**
 * Which engine produced a risk: case-based reasoning, or the expert rules.
 *
 * The API does not label this reliably — `source` arrives absent, in mixed case,
 * or under any of three spellings for the rule engine — so the client has to work
 * it out. That makes this a business rule living on the wrong side of the wire;
 * keeping it here, pure and tested, at least makes it visible and verifiable
 * instead of buried in a render function.
 */

/** Values the API uses for the case-based reasoning engine. */
export const CBR_SOURCE = 'cbr';

/** Values the API uses for the expert-rule engine, all of which mean the same thing. */
export const EXPERT_RULE_SOURCES = Object.freeze([
  'expert_rules',
  'decision_tree',
  'expert_rules_early_warning',
]);

const normalize = (source) => (typeof source === 'string' ? source.trim().toLowerCase() : '');

/**
 * Resolves a risk's engine, falling back to the shape of the payload.
 *
 * A risk carrying case evidence (`basedOnCases`, `similarityBreakdown`, a numeric
 * `similarity`) came from CBR; one carrying `indicators` came from the rules.
 *
 * @param {object} risk
 * @returns {string} A normalized source, or '' when it cannot be determined.
 */
export function inferRiskSource(risk) {
  const declared = normalize(risk?.source);
  if (declared) return declared;

  if (
    risk?.basedOnCases?.length ||
    risk?.similarityBreakdown ||
    typeof risk?.similarity === 'number'
  ) {
    return CBR_SOURCE;
  }

  if (risk?.indicators?.length) return EXPERT_RULE_SOURCES[0];

  return '';
}

/** @returns {boolean} True when the risk came from case-based reasoning. */
export const isCbrRisk = (risk) => inferRiskSource(risk) === CBR_SOURCE;

/** @returns {boolean} True when the risk came from the expert rules. */
export const isExpertRuleRisk = (risk) => EXPERT_RULE_SOURCES.includes(inferRiskSource(risk));

/**
 * Splits a mixed list into the two engines.
 *
 * Risks whose engine cannot be determined land in neither bucket, which is what
 * the previous inline filters did too — surfaced here so the loss is explicit.
 *
 * @param {Array<object>} risks
 * @returns {{cbr: object[], expertRules: object[], unclassified: object[]}}
 */
export function partitionRisksBySource(risks = []) {
  const cbr = [];
  const expertRules = [];
  const unclassified = [];

  for (const risk of risks) {
    if (isCbrRisk(risk)) cbr.push(risk);
    else if (isExpertRuleRisk(risk)) expertRules.push(risk);
    else unclassified.push(risk);
  }

  return { cbr, expertRules, unclassified };
}
