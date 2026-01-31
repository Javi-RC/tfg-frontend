import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCVs } from '../api/cv';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook for Admin CV List page business logic
 * Manages loading, searching, and filtering all CVs (admin only)
 */
export function useAdminCVList() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [cvs, setCVs] = useState([]);
  const [filteredCVs, setFilteredCVs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (user?.role !== 'org_admin') {
      setError('Unauthorized access. Admin privileges required.');
      setLoading(false);
      return;
    }
    loadAllCVs();
  }, [user]);

  /**
   * Load all CVs from API (admin only)
   */
  const loadAllCVs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllCVs();
      const cvsData = response.data?.cvs || response.data;
      setCVs(cvsData);
      setFilteredCVs(cvsData);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading CVs');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search results
   */
  const handleSearchResults = (results) => {
    setFilteredCVs(results);
  };

  /**
   * Reset search and show all CVs
   */
  const handleResetSearch = () => {
    setFilteredCVs(cvs);
    setShowSearch(false);
  };

  /**
   * Toggle search panel visibility
   */
  const toggleSearch = () => {
    setShowSearch(prev => !prev);
  };

  /**
   * Navigate to CV detail page
   */
  const navigateToCVDetail = (cvId) => {
    navigate(`/admin/cvs/${cvId}`);
  };

  return {
    // State
    cvs,
    filteredCVs,
    loading,
    error,
    selectedCV,
    showSearch,
    
    // Actions
    setSelectedCV,
    setShowSearch,
    loadAllCVs,
    handleSearchResults,
    handleResetSearch,
    toggleSearch,
    navigateToCVDetail
  };
}
