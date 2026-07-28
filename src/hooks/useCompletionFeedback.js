import { useNavigate } from 'react-router-dom';

/**
 * Drives the post-completion feedback banner on the project detail page.
 * The banner points the project manager to the risk retrospective
 * (/projects/:id/completion), which is where the outcome is actually captured.
 */
export function useCompletionFeedback({ project }) {
  const navigate = useNavigate();

  const outcomeCaptured = Boolean(project?.hasOutcome || project?.projectOutcome?.completed);
  const feedbackStatus = outcomeCaptured ? 'completed' : 'pending';

  const handleOpenRetrospective = () => {
    navigate(`/projects/${project._id}/completion`);
  };

  return {
    feedbackStatus,
    handleOpenRetrospective,
  };
}
