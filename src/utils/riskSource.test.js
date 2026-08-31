import {
  CBR_SOURCE,
  EXPERT_RULE_SOURCES,
  inferRiskSource,
  isCbrRisk,
  isExpertRuleRisk,
  partitionRisksBySource,
} from './riskSource';

describe('inferRiskSource', () => {
  describe('when the API declares the source', () => {
    it('returns it normalized', () => {
      expect(inferRiskSource({ source: 'cbr' })).toBe(CBR_SOURCE);
      expect(inferRiskSource({ source: 'CBR' })).toBe(CBR_SOURCE);
      expect(inferRiskSource({ source: '  Expert_Rules ' })).toBe('expert_rules');
    });

    it('prefers the declared source over the payload shape', () => {
      expect(inferRiskSource({ source: 'cbr', indicators: ['a'] })).toBe(CBR_SOURCE);
    });
  });

  describe('when the source is missing', () => {
    it('reads case evidence as CBR', () => {
      expect(inferRiskSource({ basedOnCases: [{ id: '1' }] })).toBe(CBR_SOURCE);
      expect(inferRiskSource({ similarityBreakdown: { technical: 0.4 } })).toBe(CBR_SOURCE);
      expect(inferRiskSource({ similarity: 0.82 })).toBe(CBR_SOURCE);
    });

    it('treats a similarity of zero as case evidence, since it is still a score', () => {
      expect(inferRiskSource({ similarity: 0 })).toBe(CBR_SOURCE);
    });

    it('reads indicators as an expert rule', () => {
      expect(inferRiskSource({ indicators: ['low_overlap'] })).toBe(EXPERT_RULE_SOURCES[0]);
    });

    it('returns empty when there is nothing to go on', () => {
      expect(inferRiskSource({})).toBe('');
      expect(inferRiskSource({ basedOnCases: [], indicators: [] })).toBe('');
      expect(inferRiskSource(null)).toBe('');
      expect(inferRiskSource(undefined)).toBe('');
    });

    it('ignores a non-string source', () => {
      expect(inferRiskSource({ source: 42 })).toBe('');
    });
  });
});

describe('isCbrRisk / isExpertRuleRisk', () => {
  it('recognises all three spellings the rule engine uses', () => {
    for (const source of EXPERT_RULE_SOURCES) {
      expect(isExpertRuleRisk({ source })).toBe(true);
      expect(isCbrRisk({ source })).toBe(false);
    }
  });

  it('keeps the two engines mutually exclusive', () => {
    expect(isCbrRisk({ source: 'cbr' })).toBe(true);
    expect(isExpertRuleRisk({ source: 'cbr' })).toBe(false);
  });

  it('claims nothing for an unclassifiable risk', () => {
    expect(isCbrRisk({})).toBe(false);
    expect(isExpertRuleRisk({})).toBe(false);
  });
});

describe('partitionRisksBySource', () => {
  it('splits a mixed list by engine', () => {
    const { cbr, expertRules, unclassified } = partitionRisksBySource([
      { id: 'a', source: 'cbr' },
      { id: 'b', source: 'decision_tree' },
      { id: 'c', similarity: 0.5 },
      { id: 'd', indicators: ['x'] },
      { id: 'e' },
    ]);

    expect(cbr.map((r) => r.id)).toEqual(['a', 'c']);
    expect(expertRules.map((r) => r.id)).toEqual(['b', 'd']);
    expect(unclassified.map((r) => r.id)).toEqual(['e']);
  });

  it('places every risk in exactly one bucket', () => {
    const risks = [
      { source: 'cbr' },
      { source: 'expert_rules' },
      { source: 'expert_rules_early_warning' },
      {},
    ];

    const { cbr, expertRules, unclassified } = partitionRisksBySource(risks);

    expect(cbr.length + expertRules.length + unclassified.length).toBe(risks.length);
  });

  it('handles an empty or omitted list', () => {
    expect(partitionRisksBySource([])).toEqual({ cbr: [], expertRules: [], unclassified: [] });
    expect(partitionRisksBySource()).toEqual({ cbr: [], expertRules: [], unclassified: [] });
  });
});
