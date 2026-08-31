/**
 * Hands a generated file to the user and releases it again.
 *
 * The object URL pins its blob in memory until revoked. The export handlers used
 * to create one per click and never revoke it, so every export leaked the whole
 * serialized payload for the lifetime of the tab.
 *
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.rel = 'noopener';

  document.body.appendChild(link);
  link.click();
  link.remove();

  // Deferred: revoking synchronously can cancel the download in some browsers
  // before it has read the blob.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Builds a filename stem that is safe on every filesystem.
 *
 * @param {...string} parts
 * @returns {string}
 */
export function toSafeFilename(...parts) {
  return parts
    .filter(Boolean)
    .join('-')
    .replace(/[^a-zA-Z0-9-_.]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}
