# Deploying to datacrumbs.org/appointment

The main site (datacrumbs.org) is a separate Next.js app on Vercel. This app
stays in its own repo and its own Vercel project; the main site forwards
`/appointment/*` to it with a rewrite. Nothing needs to be merged between repos.

```
visitor → datacrumbs.org/appointment/...
        → (rewrite in the main site's next.config)
        → this project's Vercel deployment
```

## Step 1 — Deploy this repo as its own Vercel project

Import `syedabis/appointment` into Vercel. The repo root is already the Next.js
project root, so leave the root directory setting alone.

Set these environment variables in the Vercel project (Settings →
Environment Variables), for Production and Preview:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_BASE_PATH` | `/appointment` |
| `GOOGLE_SHEET_ID` | the id from the spreadsheet URL |
| `GOOGLE_SHEET_NAME` | `Bookings` |
| `GOOGLE_CLIENT_EMAIL` | the service account address |
| `GOOGLE_PRIVATE_KEY` | the full key, `\n` sequences left intact |

`GOOGLE_PRIVATE_KEY` must keep its literal `\n` sequences — paste it exactly as
it appears in the JSON key file. The app expands them back into real newlines at
runtime.

Note the deployment URL Vercel gives you, e.g.
`https://appointment-xyz.vercel.app`. Step 2 needs it.

## Step 2 — Add the rewrite in the datacrumbs.org repo

In the **main site's** `next.config.js` / `next.config.ts`:

```js
async rewrites() {
  return [
    {
      source: "/appointment",
      destination: "https://appointment-xyz.vercel.app/appointment",
    },
    {
      source: "/appointment/:path*",
      destination: "https://appointment-xyz.vercel.app/appointment/:path*",
    },
  ];
}
```

Both rules are required: `/appointment/:path*` does not match the bare
`/appointment` URL. If the main site already has a `rewrites()` function, add
these two entries to the existing array rather than replacing it.

Deploy the main site, then visit `datacrumbs.org/appointment`.

## Why NEXT_PUBLIC_BASE_PATH matters

Without it this app serves its assets from `/_next/...` and its API from
`/api/bookings` — paths that belong to the main site, which would return its own
404s. `basePath` moves everything under `/appointment`, so the two rewrite rules
above capture the page, the JS/CSS chunks, the logo images, and the API in one
go.

Two things Next.js does *not* prefix automatically are raw `<img src>` strings
and raw `fetch()` URLs. Those go through `withBasePath()` in
`src/lib/basePath.ts` — use it for any new hard-coded local path.

## Local development

Leave `NEXT_PUBLIC_BASE_PATH` unset in `.env`. `withBasePath()` returns the path
unchanged and the app runs at `http://localhost:3000` as before.

To reproduce the production layout locally:

```bash
NEXT_PUBLIC_BASE_PATH=/appointment npm run build
NEXT_PUBLIC_BASE_PATH=/appointment npm run start
# → http://localhost:3000/appointment
```

## Simpler alternative

If a sub-path is not a hard requirement, point `appointment.datacrumbs.org` at
this Vercel project as a custom domain. No rewrite and no `basePath` needed —
just leave `NEXT_PUBLIC_BASE_PATH` unset.
