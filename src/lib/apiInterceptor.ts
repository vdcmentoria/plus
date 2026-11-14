import {
  getDeviceFingerprint,
  enforceClientIpBanLockout,
  clearClientLockoutStored,
} from './deviceFingerprint';

let interceptorInstalled = false;

export function installSecurityFetchInterceptor(): void {
  if (typeof window === 'undefined' || interceptorInstalled) return;
  interceptorInstalled = true;

  const visitorId = getDeviceFingerprint();

  try {
    document.cookie = `fp_device_id=${encodeURIComponent(visitorId)}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // ignore cookie errors in restricted contexts
  }

  try {
    const rawFetch = window.fetch;
    if (typeof rawFetch !== 'function') return;
    const originalFetch = rawFetch.bind(window);

    const wrappedFetch = async (
      input: RequestInfo | URL,
      init?: RequestInit
    ): Promise<Response> => {
      const urlStr =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : input?.url || '';

      const isLocalApi =
        urlStr.startsWith('/api/') ||
        urlStr.includes(`${window.location.origin}/api/`);

      let nextInit = init;
      if (isLocalApi) {
        const headers = new Headers(init?.headers || {});
        if (!headers.has('X-Device-Fingerprint')) {
          headers.set('X-Device-Fingerprint', visitorId);
        }
        nextInit = {
          ...init,
          headers,
        };
      }

      const response = await originalFetch(input, nextInit);

      if (isLocalApi && response.status === 403) {
        try {
          const cloned = response.clone();
          const data = await cloned.json();
          if (
            data &&
            (data.code === 'IP_BANNED' ||
              data.code === 'DISPOSABLE_EMAIL_BLOCKED' ||
              data.banned === true)
          ) {
            enforceClientIpBanLockout();
          }
        } catch {
          // non-JSON 403
        }
      } else if (isLocalApi && response.ok) {
        clearClientLockoutStored();
      }

      return response;
    };

    const desc =
      Object.getOwnPropertyDescriptor(window, 'fetch') ||
      Object.getOwnPropertyDescriptor( Object.getPrototypeOf(window), 'fetch');

    if (!desc || desc.writable) {
      window.fetch = wrappedFetch as typeof window.fetch;
    } else if (desc.configurable) {
      Object.defineProperty(window, 'fetch', {
        value: wrappedFetch,
        writable: true,
        configurable: true,
      });
    }
  } catch {
    // Environment locks window.fetch with a non-configurable getter; cookie + explicit headers handle security checks
  }
}
