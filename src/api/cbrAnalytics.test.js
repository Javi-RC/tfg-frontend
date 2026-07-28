import api from './axios';
import {
  getOrganizationRiskInsights,
  getOrganizationRiskStats,
  getOrganizationRiskAccuracy,
  getCaseBaseStats,
  getOrganizationCases,
  getCaseById,
  getSeedCases,
  loadSeedCases,
} from './cbrAnalytics';

jest.mock('./axios');
jest.mock('../utils/language', () => ({ getCurrentLanguage: () => 'en' }));

describe('cbrAnalytics API', () => {
  afterEach(() => jest.clearAllMocks());

  const orgId = 'org-1';

  it('getOrganizationRiskInsights hits the insights route with lang', async () => {
    api.get.mockResolvedValue({ data: { data: {} } });
    await getOrganizationRiskInsights(orgId);
    expect(api.get).toHaveBeenCalledWith(`/api/organizations/${orgId}/risks/insights`, {
      params: { lang: 'en' },
    });
  });

  it('getOrganizationRiskStats hits the stats route', async () => {
    api.get.mockResolvedValue({ data: {} });
    await getOrganizationRiskStats(orgId);
    expect(api.get).toHaveBeenCalledWith(`/api/organizations/${orgId}/risks/stats`);
  });

  it('getOrganizationRiskAccuracy hits the accuracy route', async () => {
    api.get.mockResolvedValue({ data: {} });
    await getOrganizationRiskAccuracy(orgId);
    expect(api.get).toHaveBeenCalledWith(`/api/organizations/${orgId}/risks/accuracy`);
  });

  it('getCaseBaseStats hits the case-base stats route', async () => {
    api.get.mockResolvedValue({ data: {} });
    await getCaseBaseStats(orgId);
    expect(api.get).toHaveBeenCalledWith(`/api/organizations/${orgId}/case-base/stats`);
  });

  it('getOrganizationCases hits the cases route with params', async () => {
    api.get.mockResolvedValue({ data: {} });
    await getOrganizationCases(orgId, { type: 'real' });
    expect(api.get).toHaveBeenCalledWith(`/api/organizations/${orgId}/case-base/cases`, {
      params: { type: 'real' },
    });
  });

  it('getCaseById hits the case route', async () => {
    api.get.mockResolvedValue({ data: {} });
    await getCaseById('case-9');
    expect(api.get).toHaveBeenCalledWith('/api/case-base/case-9');
  });

  it('getSeedCases and loadSeedCases hit the seed route', async () => {
    api.get.mockResolvedValue({ data: {} });
    api.post.mockResolvedValue({ data: {} });
    await getSeedCases();
    await loadSeedCases();
    expect(api.get).toHaveBeenCalledWith('/api/case-base/seed');
    expect(api.post).toHaveBeenCalledWith('/api/case-base/seed');
  });
});
