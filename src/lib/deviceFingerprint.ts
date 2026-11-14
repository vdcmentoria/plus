// Hardware & Browser Device Fingerprint Generator + Client Ban Lockout

const FP_STORAGE_KEY = 'framepro_device_vid_v1';
const BAN_LOCKOUT_KEY = 'framepro_ban_lockout_v1';

function fnv1aHash(str: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 ^= ch;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= ch ^ (i & 0xff);
    h2 = Math.imul(h2, 0x100001b3);
  }
  return (
    (h1 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0')
  );
}

function getWebGLInfo(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return 'no-webgl';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-ext';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    return `${vendor}~${renderer}`;
  } catch {
    return 'webgl-err';
  }
}

function getCanvasHash(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-2d';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(10, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '14px Arial';
    ctx.fillText('FramePro-FP-Sec#2026', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '16px Georgia';
    ctx.fillText('FramePro-FP-Sec#2026', 4, 35);
    return fnv1aHash(canvas.toDataURL());
  } catch {
    return 'canvas-err';
  }
}

let cachedVisitorId: string | null = null;

export function getDeviceFingerprint(): string {
  if (cachedVisitorId) return cachedVisitorId;
  if (typeof window === 'undefined') return 'srv-node';

  try {
    const stored = window.localStorage.getItem(FP_STORAGE_KEY);
    if (stored && stored.length >= 12) {
      cachedVisitorId = stored;
      return stored;
    }
  } catch {
    // Ignore storage access errors
  }

  try {
    const nav = window.navigator;
    const scr = window.screen;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const rawParts = [
      nav.userAgent || '',
      nav.language || '',
      (nav.languages || []).join(','),
      String(nav.hardwareConcurrency || 0),
      String((nav as Navigator & { deviceMemory?: number }).deviceMemory || 0),
      String(nav.maxTouchPoints || 0),
      `${scr?.width || 0}x${scr?.height || 0}x${scr?.colorDepth || 0}`,
      tz,
      getWebGLInfo(),
      getCanvasHash(),
    ];
    const hash = `fp_${fnv1aHash(rawParts.join('|'))}`;
    cachedVisitorId = hash;
    try {
      window.localStorage.setItem(FP_STORAGE_KEY, hash);
    } catch {
      // ignore
    }
    return hash;
  } catch {
    const fallback = `fp_${fnv1aHash(String(Date.now()) + Math.random())}`;
    cachedVisitorId = fallback;
    return fallback;
  }
}

let lockoutEnforced = false;

export function enforceClientIpBanLockout(): void {
  if (typeof window === 'undefined' || lockoutEnforced) return;
  lockoutEnforced = true;

  try {
    const vid = getDeviceFingerprint();
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.localStorage.setItem(FP_STORAGE_KEY, vid);
    window.localStorage.setItem(BAN_LOCKOUT_KEY, '1');
  } catch {
    // ignore storage errors
  }

  try {
    document.title = '';
    if (document.body) {
      document.body.innerHTML = '';
      document.body.style.cssText =
        'margin:0;padding:0;background:#ffffff;min-height:100vh;overflow:hidden;pointer-events:none;user-select:none;';
    }
  } catch {
    // ignore DOM errors
  }
}

export function isClientLockoutStored(): boolean {
  try {
    return window.localStorage.getItem(BAN_LOCKOUT_KEY) === '1';
  } catch {
    return false;
  }
}

export function clearClientLockoutStored(): void {
  try {
    window.localStorage.removeItem(BAN_LOCKOUT_KEY);
    lockoutEnforced = false;
  } catch {
    // ignore
  }
}
