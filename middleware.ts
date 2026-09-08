/**
 * HTTP Basic Auth for the client hub (clients.arts-link.com).
 *
 * One repo builds two Vercel projects, and Vercel picks up this file for both
 * of them — so the gate is keyed on environment variables rather than on the
 * project. The public site sets neither variable and the middleware falls
 * straight through; the clients project sets both and nothing is served without
 * them.
 *
 * `.ts` rather than `.js` on purpose: Vercel's docs require a no-framework
 * project to declare `"type": "module"` or use `.mjs` for JavaScript
 * middleware, and `"type": "module"` would break postcss.config.js and
 * tailwind.config.js, both of which are CommonJS.
 *
 * Returning undefined continues to the static asset. That avoids a dependency
 * on @vercel/functions' next() helper.
 */

export const config = {
  // Static assets carry nothing private — the pages do. Skipping them keeps
  // this off the hot path, since middleware bills per invocation.
  matcher: ["/((?!_vercel|favicon\\.ico|favicon\\.svg|fonts/|js/|images/|og/).*)"],
};

/** Length-independent comparison, so a wrong answer takes the same time. */
function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);
  // Fold the length difference into the result rather than returning early.
  let diff = aBytes.length ^ bBytes.length;
  const len = Math.max(aBytes.length, bBytes.length);
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

function challenge(): Response {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Arts-Link", charset="UTF-8"',
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default function middleware(request: Request): Response | undefined {
  const user = process.env.CLIENT_HUB_USER;
  const pass = process.env.CLIENT_HUB_PASS;

  // Not configured — this is the public production build. Do nothing.
  if (!user || !pass) return undefined;

  const header = request.headers.get("authorization");
  if (!header || !header.toLowerCase().startsWith("basic ")) return challenge();

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return challenge();
  }

  // Only the first colon separates them; a password may contain more.
  const sep = decoded.indexOf(":");
  if (sep === -1) return challenge();

  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), pass);
  // Evaluate both before deciding, so the failure tells you nothing about which.
  if (!okUser || !okPass) return challenge();

  return undefined;
}
