import { loaderRef } from './loaderRef';

/**
 * Fetch wrapper. Shows the global loader only when `loaderMessage` is provided.
 * Use for user-initiated actions (checkout, submit, delete). Page loads should use fetch() directly.
 */
export async function apiFetch(url, options = {}) {
  const { loaderMessage, ...fetchOptions } = options;

  const loader = loaderRef.current;
  const shouldShowLoader = Boolean(loaderMessage && loader);

  if (shouldShowLoader) {
    loader.show(loaderMessage);
  }

  try {
    return await fetch(url, fetchOptions);
  } finally {
    if (shouldShowLoader) {
      loader.hide();
    }
  }
}

export default apiFetch;
