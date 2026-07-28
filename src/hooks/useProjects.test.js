import { renderHook, act, waitFor } from '@testing-library/react';
import { useProjects } from './useProjects';
import { getMyProjects, getAssignedProjects, deleteProject, getProjectById } from '../api/projects';
import { getMyOrganizations } from '../api/organization';
import { AuthContext } from '../contexts/AuthContextObj';

jest.mock('../api/projects', () => ({
  getMyProjects: jest.fn(),
  getAssignedProjects: jest.fn(),
  deleteProject: jest.fn(),
  getProjectById: jest.fn(),
}));
jest.mock('../api/organization', () => ({
  getMyOrganizations: jest.fn(),
}));
jest.mock('../i18n', () => ({
  default: { use: jest.fn().mockReturnThis(), init: jest.fn(), language: 'en' },
}));

const mockUser = { userId: 'user1', name: 'Test User' };

const wrapper = ({ children }) => (
  <AuthContext.Provider value={{ user: mockUser }}>{children}</AuthContext.Provider>
);

const mockOrganizations = [
  {
    _id: 'org1',
    name: 'Org 1',
    employees: [
      { user: { _id: 'user1' }, isProjectManager: true },
      { user: { _id: 'user2' }, isProjectManager: false },
    ],
  },
];

const mockMyProjects = [
  {
    _id: 'p1',
    name: 'My Project',
    status: 'active',
    organization: { _id: 'org1' },
    projectManager: { _id: 'user1', name: 'Manager' },
  },
  {
    _id: 'p2',
    name: 'My Draft',
    status: 'draft',
    organization: { _id: 'org2' },
    projectManager: { _id: 'user1', name: 'Manager' },
  },
];

const mockAssignedProjects = [
  {
    _id: 'p3',
    name: 'Assigned Project',
    status: 'active',
    organization: { _id: 'org1' },
    projectManager: { _id: 'user2', name: 'Other' },
  },
];

describe('useProjects Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getMyOrganizations.mockResolvedValue({
      data: { success: true, data: mockOrganizations },
    });

    getMyProjects.mockResolvedValue({
      data: { success: true, data: mockMyProjects },
    });

    getAssignedProjects.mockResolvedValue({
      data: { success: true, data: mockAssignedProjects },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial load', () => {
    it('loads myProjects, assignedProjects, and organizations on mount', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(getMyOrganizations).toHaveBeenCalledTimes(1);
      expect(getMyProjects).toHaveBeenCalledTimes(1);
      expect(getAssignedProjects).toHaveBeenCalledTimes(1);
      expect(result.current.myProjects).toEqual(mockMyProjects);
      expect(result.current.assignedProjects).toEqual(mockAssignedProjects);
      expect(result.current.organizations).toEqual(mockOrganizations);
    });

    it('sets loading to false after data loads', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles nested data.success.data format', async () => {
      getMyOrganizations.mockResolvedValueOnce({
        data: { success: true, data: mockOrganizations },
      });
      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: mockMyProjects },
      });
      getAssignedProjects.mockResolvedValueOnce({
        data: { success: true, data: mockAssignedProjects },
      });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.myProjects).toEqual(mockMyProjects);
      });
    });

    it('handles flat data format (no success wrapper)', async () => {
      getMyOrganizations.mockResolvedValueOnce({
        data: mockOrganizations,
      });
      getMyProjects.mockResolvedValueOnce({
        data: mockMyProjects,
      });
      getAssignedProjects.mockResolvedValueOnce({
        data: mockAssignedProjects,
      });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.myProjects).toEqual(mockMyProjects);
        expect(result.current.assignedProjects).toEqual(mockAssignedProjects);
      });
    });
  });

  describe('API errors', () => {
    it('handles organizations API error gracefully', async () => {
      getMyOrganizations.mockRejectedValueOnce(new Error('Org fetch failed'));

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.organizations).toEqual([]);
      expect(result.current.isProjectManager).toBe(false);
    });

    it('handles myProjects API error gracefully', async () => {
      getMyProjects.mockRejectedValueOnce(new Error('Projects fetch failed'));

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.myProjects).toEqual([]);
    });

    it('handles assignedProjects API error gracefully', async () => {
      getAssignedProjects.mockRejectedValueOnce(new Error('Assigned fetch failed'));

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.assignedProjects).toEqual([]);
    });

    it('sets loading=false when loadData fails', async () => {
      getMyOrganizations.mockRejectedValueOnce(new Error('fail'));
      getMyProjects.mockRejectedValueOnce(new Error('fail'));
      getAssignedProjects.mockRejectedValueOnce(new Error('fail'));

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('filtering', () => {
    it('filters projects by status', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilterStatus('active');
      });

      await waitFor(() => {
        expect(result.current.filteredProjects).toEqual([
          expect.objectContaining({ _id: 'p1', status: 'active' }),
        ]);
      });
    });

    it('filters projects by organization', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilterOrg('org2');
      });

      await waitFor(() => {
        expect(result.current.filteredProjects).toEqual([
          expect.objectContaining({ _id: 'p2' }),
        ]);
      });
    });

    it('returns all projects when filters are "all"', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.filterStatus).toBe('all');
      expect(result.current.filterOrg).toBe('all');
      expect(result.current.filteredProjects).toEqual(mockMyProjects);
    });

    it('applies both status and organization filters together', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilterStatus('active');
        result.current.setFilterOrg('org1');
      });

      await waitFor(() => {
        expect(result.current.filteredProjects).toEqual([
          expect.objectContaining({ _id: 'p1', status: 'active' }),
        ]);
      });
    });

    it('filters by organization when organization is a string ID', async () => {
      const projectsWithStringOrg = [
        { _id: 'p1', status: 'active', organization: 'org1' },
        { _id: 'p2', status: 'active', organization: 'org2' },
      ];
      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: projectsWithStringOrg },
      });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setFilterOrg('org2');
      });

      await waitFor(() => {
        expect(result.current.filteredProjects).toEqual([
          expect.objectContaining({ _id: 'p2' }),
        ]);
      });
    });

    it('re-triggers loadMyProjects when filterStatus changes', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      act(() => {
        result.current.setFilterStatus('completed');
      });

      await waitFor(() => {
        expect(getMyProjects).toHaveBeenLastCalledWith({ status: 'completed' });
      });
    });

    it('re-triggers loadMyProjects when filterOrg changes', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      act(() => {
        result.current.setFilterOrg('org1');
      });

      await waitFor(() => {
        expect(getMyProjects).toHaveBeenLastCalledWith({ organizationId: 'org1' });
      });
    });

    it('does not pass status param when filterStatus is "all"', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      act(() => {
        result.current.setFilterOrg('org1');
      });

      await waitFor(() => {
        expect(getMyProjects).toHaveBeenLastCalledWith({ organizationId: 'org1' });
      });
    });
  });

  describe('activeTab', () => {
    it('defaults to "my-projects"', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      expect(result.current.activeTab).toBe('my-projects');
    });

    it('switches to assigned projects tab', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setActiveTab('assigned');
      });

      expect(result.current.activeTab).toBe('assigned');
      expect(result.current.currentProjects).toEqual(mockAssignedProjects);
    });

    it('switches back to my projects tab', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setActiveTab('assigned');
      });

      act(() => {
        result.current.setActiveTab('my-projects');
      });

      expect(result.current.currentProjects).toEqual(mockMyProjects);
    });
  });

  describe('handleDeleteProject', () => {
    it('calls deleteProject and removes from myProjects list', async () => {
      deleteProject.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.handleDeleteProject('p1');
      });

      expect(deleteProject).toHaveBeenCalledWith('p1');
      expect(result.current.myProjects).not.toContainEqual(
        expect.objectContaining({ _id: 'p1' })
      );
      expect(result.current.myProjects).toEqual(
        expect.arrayContaining([expect.objectContaining({ _id: 'p2' })])
      );
    });

    it('removes from assignedProjects when on assigned tab', async () => {
      deleteProject.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.setActiveTab('assigned');
      });

      await act(async () => {
        await result.current.handleDeleteProject('p3');
      });

      expect(result.current.assignedProjects).toEqual([]);
    });
  });

  describe('populateProjectManager', () => {
    it('fetches full project when projectManager is a string ID', async () => {
      const projectWithStringPM = [
        {
          _id: 'p4',
          name: 'String PM Project',
          status: 'active',
          projectManager: 'user3',
        },
      ];
      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: projectWithStringPM },
      });
      getProjectById.mockResolvedValueOnce({
        data: {
          success: true,
          data: { ...projectWithStringPM[0], projectManager: { _id: 'user3', name: 'Populated' } },
        },
      });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(getProjectById).toHaveBeenCalledWith('p4', false);
      expect(result.current.myProjects[0].projectManager).toEqual(
        expect.objectContaining({ _id: 'user3', name: 'Populated' })
      );
    });

    it('returns original project when getProjectById fails', async () => {
      const projectWithStringPM = [
        {
          _id: 'p5',
          name: 'Fail Populate',
          status: 'draft',
          projectManager: 'user4',
        },
      ];
      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: projectWithStringPM },
      });
      getProjectById.mockRejectedValueOnce(new Error('not found'));

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.myProjects[0].projectManager).toBe('user4');
    });

    it('does not fetch when projectManager is already an object', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(getProjectById).not.toHaveBeenCalled();
    });
  });

  describe('project manager status', () => {
    it('sets isProjectManager=true when user is PM in an organization', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isProjectManager).toBe(true);
    });

    it('sets isProjectManager=false when user is not PM', async () => {
      const nonPMUser = { userId: 'user2' };

      const nonPMWrapper = ({ children }) => (
        <AuthContext.Provider value={{ user: nonPMUser }}>{children}</AuthContext.Provider>
      );

      const { result } = renderHook(() => useProjects(), { wrapper: nonPMWrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isProjectManager).toBe(false);
    });

    it('handles employee with string user ID', async () => {
      const orgWithStringUser = [
        {
          _id: 'org3',
          employees: [
            { user: 'user1', isProjectManager: true },
          ],
        },
      ];
      getMyOrganizations.mockResolvedValueOnce({
        data: { success: true, data: orgWithStringUser },
      });
      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });
      getAssignedProjects.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isProjectManager).toBe(true);
    });
  });

  describe('reloadProjects', () => {
    it('reloads all data when reloadProjects is called', async () => {
      const { result } = renderHook(() => useProjects(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newProjects = [{ _id: 'p9', name: 'New Project', status: 'active' }];
      getMyProjects.mockResolvedValueOnce({
        data: { success: true, data: newProjects },
      });
      getAssignedProjects.mockResolvedValueOnce({
        data: { success: true, data: [] },
      });

      await act(async () => {
        await result.current.reloadProjects();
      });

      await waitFor(() => {
        expect(result.current.myProjects).toEqual(newProjects);
      });
    });
  });
});
