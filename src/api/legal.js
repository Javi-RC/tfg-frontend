import api from './axios';

/**
 * Legal documents API
 *
 * Backend contract:
 * - GET /api/legal/terms -> JSON { document: { version, lastUpdated, content (markdown) } }
 * - GET /api/legal/terms?format=markdown -> text/markdown
 * - GET /api/legal/terms?format=text -> text/plain
 * - GET /api/legal/terms?locale=es (other locales -> 406)
 */

export const getTerms = ({ locale, format } = {}) => {
  const params = {};
  if (locale) params.locale = locale;
  if (format) params.format = format;

  const responseType = format ? 'text' : 'json';

  return api.get('/api/legal/terms', {
    params,
    responseType
  });
};

export default {
  getTerms
};
