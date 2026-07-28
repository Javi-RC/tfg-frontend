import api from './axios';
import { createProject, getProjectById, updateProject, deleteProject } from './projects';

jest.mock('./axios');

describe('projects API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('sends POST request to /api/projects with project data', async () => {
      const projectData = {
        name: 'New Project',
        description: 'Project description',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      };
      const mockResponse = {
        data: {
          project: { id: 1, ...projectData },
        },
      };
      api.post.mockResolvedValue(mockResponse);

      const result = await createProject(projectData);

      expect(api.post).toHaveBeenCalledWith('/api/projects', projectData);
      expect(result).toEqual(mockResponse);
    });

    it('handles validation errors', async () => {
      const projectData = { name: '' };
      const mockError = new Error('Name is required');
      api.post.mockRejectedValue(mockError);

      await expect(createProject(projectData)).rejects.toThrow('Name is required');
    });

    it('handles network errors', async () => {
      const projectData = { name: 'Test' };
      const mockError = new Error('Network error');
      api.post.mockRejectedValue(mockError);

      await expect(createProject(projectData)).rejects.toThrow('Network error');
    });
  });

  describe('getProjectById', () => {
    it('sends GET request to /api/projects/:id with default params', async () => {
      const projectId = '123';
      const mockResponse = {
        data: {
          project: { id: 123, name: 'Test Project' },
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await getProjectById(projectId);

      expect(api.get).toHaveBeenCalledWith(`/api/projects/${projectId}`, {
        params: { includeEmployees: true },
      });
      expect(result).toEqual(mockResponse);
    });

    it('includes employee details when specified', async () => {
      const projectId = '456';
      const mockResponse = { data: { project: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getProjectById(projectId, true);

      expect(api.get).toHaveBeenCalledWith(`/api/projects/${projectId}`, {
        params: { includeEmployees: true },
      });
    });

    it('excludes employee details when specified', async () => {
      const projectId = '789';
      const mockResponse = { data: { project: {} } };
      api.get.mockResolvedValue(mockResponse);

      await getProjectById(projectId, false);

      expect(api.get).toHaveBeenCalledWith(`/api/projects/${projectId}`, {
        params: { includeEmployees: false },
      });
    });

    it('handles not found errors', async () => {
      const projectId = '999';
      const mockError = new Error('Project not found');
      api.get.mockRejectedValue(mockError);

      await expect(getProjectById(projectId)).rejects.toThrow('Project not found');
    });
  });

  describe('updateProject', () => {
    it('sends PUT request to /api/projects/:id with updated data', async () => {
      const projectId = '123';
      const updateData = {
        name: 'Updated Project',
        description: 'Updated description',
      };
      const mockResponse = {
        data: {
          project: { id: 123, ...updateData },
        },
      };
      api.put.mockResolvedValue(mockResponse);

      const result = await updateProject(projectId, updateData);

      expect(api.put).toHaveBeenCalledWith(`/api/projects/${projectId}`, updateData);
      expect(result).toEqual(mockResponse);
    });

    it('handles partial updates', async () => {
      const projectId = '456';
      const updateData = { name: 'New Name Only' };
      const mockResponse = { data: { project: updateData } };
      api.put.mockResolvedValue(mockResponse);

      await updateProject(projectId, updateData);

      expect(api.put).toHaveBeenCalledWith(`/api/projects/${projectId}`, updateData);
    });

    it('handles unauthorized errors', async () => {
      const projectId = '789';
      const updateData = { name: 'Test' };
      const mockError = new Error('Unauthorized');
      api.put.mockRejectedValue(mockError);

      await expect(updateProject(projectId, updateData)).rejects.toThrow('Unauthorized');
    });
  });

  describe('deleteProject', () => {
    it('sends DELETE request to /api/projects/:id', async () => {
      const projectId = '123';
      const mockResponse = { data: { message: 'Project deleted' } };
      api.delete.mockResolvedValue(mockResponse);

      const result = await deleteProject(projectId);

      expect(api.delete).toHaveBeenCalledWith(`/api/projects/${projectId}`);
      expect(result).toEqual(mockResponse);
    });

    it('handles forbidden errors for non-admin users', async () => {
      const projectId = '456';
      const mockError = new Error('Admin access required');
      api.delete.mockRejectedValue(mockError);

      await expect(deleteProject(projectId)).rejects.toThrow('Admin access required');
    });

    it('handles project not found', async () => {
      const projectId = '999';
      const mockError = new Error('Project not found');
      api.delete.mockRejectedValue(mockError);

      await expect(deleteProject(projectId)).rejects.toThrow('Project not found');
    });
  });
});
