/**
 * HTTP Basic Auth for the client hub (clients.arts-link.com).
 *
 * One repo builds two Vercel projects, and Vercel picks up this file for both
 * of them, so the gate is keyed on environment variables rather than on the
 * project:
 *
 *   CLIENT_HUB_ENABLED        set once on the clients project. Absent — which
 *                             is the case on the public site — and this file
 *                             does nothing at all.
 *   CLIENT_HUB_<SLUG>_USER    one pair per client, where <SLUG> is the folder
 *   CLIENT_HUB_<SLUG>_PASS    name under content-clients/ upper-cased, with
 *                             hyphens as underscores. content-clients/risa/
 *                             is CLIENT_HUB_RISA_USER / CLIENT_HUB_RISA_PASS.
 *
 * Credentials are per client on purpose. Every proposal carries pricing and
 * personal detail, so one shared password would mean each client could read
 * the others' terms.
 *
 * Within the clients deployment this fails closed: a path whose client has no
 * credentials configured is refused, not served. Adding a folder and
 * forgetting the variables leaves that client unreachable, which is the
 * failure you want.
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

/** content-clients/jill-bonovitz/ -> JILL_BONOVITZ */
function envSlug(segment: string): string {
  return segment.toUpperCase().replace(/[^A-Z0-9]/g, "_");
}

/**
 * The client a request belongs to, or null for the public surface: the root
 * stub and the root-level files beside it (robots.txt, 404.html, flyer.html).
 */
function clientOf(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  if (segments.length === 1 && segments[0].includes(".")) return null;
  return segments[0];
}

/**
 * The realm is echoed into a response header and is derived from the request
 * path, so it is sanitised twice over: header values are ByteStrings (a stray
 * em dash throws, and the 401 becomes a 500), and an unfiltered quote would let
 * a crafted URL inject into the header.
 */
function challenge(client: string): Response {
  const realm = `Arts-Link ${client}`.replace(/[^\x20-\x7E]/g, "").replace(/["\\]/g, "");
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default function middleware(request: Request): Response | undefined {
  // Not the clients deployment. Do nothing.
  if (!process.env.CLIENT_HUB_ENABLED) return undefined;

  const client = clientOf(new URL(request.url).pathname);
  // The landing stub and its neighbours are deliberately public: they name no
  // client and list nothing.
  if (client === null) return undefined;

  const slug = envSlug(client);
  const user = process.env[`CLIENT_HUB_${slug}_USER`];
  const pass = process.env[`CLIENT_HUB_${slug}_PASS`];

  // Fail closed. A client with no credentials configured is unreachable rather
  // than public.
  if (!user || !pass) return challenge(client);

  const header = request.headers.get("authorization");
  if (!header || !header.toLowerCase().startsWith("basic ")) return challenge(client);

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return challenge(client);
  }

  // Only the first colon separates them; a password may contain more.
  const sep = decoded.indexOf(":");
  if (sep === -1) return challenge(client);

  const okUser = safeEqual(decoded.slice(0, sep), user);
  const okPass = safeEqual(decoded.slice(sep + 1), pass);
  // Evaluate both before deciding, so the failure tells you nothing about which.
  if (!okUser || !okPass) return challenge(client);

  return undefined;
}
