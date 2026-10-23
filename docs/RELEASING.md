# Release checklist

Maintainer reference: follow [Publishing on GitHub](PUBLISHING.md). The first release is an explicitly labelled preview. Local packaging never uploads anything; publication is a separate reviewed step.

## Build a review candidate

1. Run `npm ci --ignore-scripts`, `npm test` and `npm run check`.
2. Review documentation against actual code, especially card limits and private package handling.
3. Run `npm run release` with Python 3 available (`PYTHON` may point to its executable).
4. Inspect the generated source ZIP and credential-free sample IPK under `release/`. Read the SHA256SUMS file.
5. Never copy a package from `private/builds/` or `private/helper-builds/` into a public release. The release script creates its own sample package with an empty connection.

The source ZIP uses an explicit public allowlist and excludes node_modules, private/build outputs, development-import scripts, local evidence and environment-specific paths. The scanner is targeted, not a substitute for manual secret review. Search the actual archive too.

## Before public availability

- Owner approves the preview and wording.
- Physical TV/base/helper testing is completed or precisely labelled as pending/experimental.
- Review dependency advisories, attribution and legacy-helper support scope.
- Verify Windows/macOS/Linux instructions with real setup attempts; do not claim CI has run from a workflow file alone.
- Verify the blueprint in an isolated HA instance before claiming HA validation.
- Add the actual public repository/release URLs only after creation. Do not publish fictional links.
- Provide source ZIP, sample IPK, checksums, screenshots and tested-model matrix. Helper distribution is source/manual instructions, not a universal native IPK.
- Confirm no private household identifiers, IPKs, tokens, pairing keys or native UID values are present.
- Keep releases versioned; document updates and rollback. Never replace public history with private deployment snapshots.

If publishing to the household Wiki/private Git as well, use the established controlled writer, preserve history, scan secrets, verify remote commit and exact replicated Wiki readback. Local files alone do not prove remote publication.
