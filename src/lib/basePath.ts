/**
 * Next.js applies `basePath` to its own routes and to the asset URLs it
 * generates, but NOT to raw strings such as an <img src="/..."> or a fetch()
 * target. Those have to be prefixed by hand, which is what this does.
 *
 * NEXT_PUBLIC_ vars are inlined at build time, so this works on both the
 * server and the client.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
