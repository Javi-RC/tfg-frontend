/**
 * Unwraps API responses to a consistent format.
 * Backend returns: { success: true, data: { ... } } or flat { ... }
 */
export const unwrapData = (response) => {
  const body = response?.data;
  if (!body) return null;
  if (body.success && body.data !== undefined) return body.data;
  return body;
};

export const unwrapUser = (response) => {
  const data = unwrapData(response);
  if (!data) return null;
  if (data.user) return data.user;
  if (data.role !== undefined || data.email !== undefined) return data;
  return null;
};
