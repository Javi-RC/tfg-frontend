/**
 * Custom hook for profile navigation shortcuts
 * @param {Object} options
 * @param {Function} options.navigate - React Router navigate function
 */
export function useProfileNavigation({ navigate }) {
  /**
   * Navigate to CV page
   */
  const navigateToCV = () => {
    navigate('/my-cv');
  };

  const navigateToUploadCV = () => {
    navigate('/my-cv?upload=true');
  };

  const navigateToCVStats = () => {
    navigate('/cv-stats');
  };

  const navigateToAdminCVs = () => {
    navigate('/admin/cvs');
  };

  return {
    navigateToCV,
    navigateToUploadCV,
    navigateToCVStats,
    navigateToAdminCVs,
  };
}
