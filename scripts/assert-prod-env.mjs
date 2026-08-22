#!/usr/bin/env node
// Runs automatically before `next build` (see the `prebuild` script in package.json).
// `next build` always produces a production bundle, and NEXT_PUBLIC_ENABLE_DEV_AUTH is
// baked into that bundle at build time — so this is the only point where the flag can
// still be caught before it ships.
if (process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === "true") {
  console.error(
    "\nRefusing to build: NEXT_PUBLIC_ENABLE_DEV_AUTH=true.\n" +
      "This flag exposes a role-spoofing auth bypass (window.__devAuth) and must never be set for a build " +
      "that will be deployed. Unset it, or set it to false, and build again.\n",
  );
  process.exit(1);
}
