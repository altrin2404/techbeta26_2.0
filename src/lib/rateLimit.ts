interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (keyed by `${prefix}:${ip}`)
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 3 minutes to keep memory minimal
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(key);
      }
    }
  }, 3 * 60 * 1000);
  
  // Prevent timer from holding process open in test/script environments
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    (cleanupTimer as { unref: () => void }).unref();
  }
}

/**
 * Extracts client IP address safely from standard proxy headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}

export interface RateLimitOptions {
  limit?: number; // max requests per window (default: 15)
  windowMs?: number; // window size in ms (default: 60,000ms = 1 minute)
  keyPrefix?: string; // route identifier prefix
}

/**
 * Checks if a request exceeds rate limits.
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetTime: number } {
  const limit = options.limit ?? 15;
  const windowMs = options.windowMs ?? 60 * 1000;
  const prefix = options.keyPrefix ?? 'general';

  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const record = ipStore.get(key);

  if (!record || now > record.resetTime) {
    ipStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}
