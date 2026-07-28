/**
 * Compute a rough profile-completion percentage from whatever fields are
 * present on a user-like object (auth user or profileUser). Used both by the
 * sidebar CTA and the profile hero progress bar so they stay in sync.
 *
 * @param {object|null|undefined} u - user-like object
 * @returns {number} completion percentage rounded to the nearest integer (0-100)
 */
export function computeProfileCompletion(u) {
  if (!u) return 0;

  const filled = (v) => typeof v === 'string' && v.trim().length > 0;

  const checks = [
    filled(u.name) || filled(u.username),
    filled(u.email),
    filled(u.country),
    filled(u.timezone),
    filled(u.avatar),
    filled(u.organization) || filled(u.organizationName) || Boolean(u.organizationId),
    typeof u.flexibleSchedule === 'boolean',
    filled(u.preferredWorkingHours?.start) && filled(u.preferredWorkingHours?.end),
    Boolean(u.notificationPreferences),
    filled(u.bio) || filled(u.about),
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
