import api from './axios';
import {
  createOrganization,
  getOrganizationById,
  updateOrganization,
  getMyOrganizations,
} from './organization';

jest.mock('./axios');

describe('organization API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrganization', () => {
    it('sends POST request to /api/organizations with organization data', async () => {
      const orgData = {
        name: 'Tech Corp',
        description: 'Technology company',
        website: 'https://techcorp.com',
      };
      const mockResponse = {
        data: {
          organization: { id: 1, ...orgData },
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await createOrganization(orgData);

      expect(api.post).toHaveBeenCalledWith('/api/organizations', orgData);
      expect(result).toEqual(mockResponse);
    });

    it('handles validation errors', async () => {
      const orgData = { name: '' };
      const mockError = new Error('Name is required');
      api.post.mockRejectedValue(mockError);

      await expect(createOrganization(orgData)).rejects.toThrow('Name is required');
    });

    it('handles duplicate organization errors', async () => {
      const orgData = { name: 'Existing Org' };
      const mockError = new Error('Organization already exists');
      api.post.mockRejectedValue(mockError);

      await expect(createOrganization(orgData)).rejects.toThrow('Organization already exists');
    });
  });

  describe('getOrganizationById', () => {
    it('sends GET request to /api/organizations/:id', async () => {
      const orgId = '123';
      const mockResponse = {
        data: {
          organization: {
            id: 123,
            name: 'Tech Corp',
            members: [],
          },
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getOrganizationById(orgId);

      expect(api.get).toHaveBeenCalledWith(`/api/organizations/${orgId}`);
      expect(result).toEqual(mockResponse);
    });

    it('handles not found errors', async () => {
      const orgId = '999';
      const mockError = new Error('Organization not found');
      api.get.mockRejectedValue(mockError);

      await expect(getOrganizationById(orgId)).rejects.toThrow('Organization not found');
    });

    it('handles unauthorized access', async () => {
      const orgId = '456';
      const mockError = new Error('Unauthorized');
      api.get.mockRejectedValue(mockError);

      await expect(getOrganizationById(orgId)).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateOrganization', () => {
    it('sends PUT request to /api/organizations/:id with updated data', async () => {
      const orgId = '123';
      const updateData = {
        name: 'Updated Corp',
        description: 'New description',
      };
      const mockResponse = {
        data: {
          organization: { id: 123, ...updateData },
        },
      };
      api.put.mockResolvedValue(mockResponse);

      const result = await updateOrganization(orgId, updateData);

      expect(api.put).toHaveBeenCalledWith(`/api/organizations/${orgId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('handles partial updates', async () => {
      const orgId = '456';
      const updateData = { website: 'https://newsite.com' };
      const mockResponse = { data: { organization: updateData } };
      api.put.mockResolvedValue(mockResponse);

      await updateOrganization(orgId, updateData);

      expect(api.put).toHaveBeenCalledWith(`/api/organizations/${orgId}`, updateData);
    });

    it('handles permission errors', async () => {
      const orgId = '789';
      const updateData = { name: 'Test' };
      const mockError = new Error('Insufficient permissions');
      api.put.mockRejectedValue(mockError);

      await expect(updateOrganization(orgId, updateData)).rejects.toThrow(
        'Insufficient permissions'
      );
    });
  });

  describe('getMyOrganizations', () => {
    it('sends GET request to /api/organizations/my-organizations', async () => {
      const mockResponse = {
        data: {
          organizations: [
            { id: 1, name: 'Org 1' },
            { id: 2, name: 'Org 2' },
          ],
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getMyOrganizations();

      expect(api.get).toHaveBeenCalledWith('/api/organizations/my-organizations');
      expect(result).toEqual(mockResponse);
    });

    it('returns empty array when user has no organizations', async () => {
      const mockResponse = { data: { organizations: [] } };
      api.get.mockResolvedValue(mockResponse);

      const result = await getMyOrganizations();

      expect(result.data.organizations).toHaveLength(0);
    });

    it('handles authentication errors', async () => {
      const mockError = new Error('Not authenticated');
      api.get.mockRejectedValue(mockError);

      await expect(getMyOrganizations()).rejects.toThrow('Not authenticated');
    });

    it('returns multiple organizations', async () => {
      const mockOrgs = [
        { id: 1, name: 'Org 1', role: 'admin' },
        { id: 2, name: 'Org 2', role: 'member' },
        { id: 3, name: 'Org 3', role: 'viewer' },
      ];
      const mockResponse = { data: { organizations: mockOrgs } };
      api.get.mockResolvedValue(mockResponse);

      const result = await getMyOrganizations();

      expect(result.data.organizations).toHaveLength(3);
      expect(result.data.organizations[0]).toHaveProperty('role');
    });
  });
});
