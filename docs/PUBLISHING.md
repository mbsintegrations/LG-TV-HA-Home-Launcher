# Maintainer guide: publish on GitHub

The project repository is [mbsintegrations/LG-TV-HA-Home-Launcher](https://github.com/mbsintegrations/LG-TV-HA-Home-Launcher). Publishing source and publishing a release are separate actions. Never publish a configured TV package.

## Prepare a version

1. Update package.json/package-lock.json, app/appinfo.json and relevant helper manifests consistently. Update the changelog, download filenames, release notes and validation scope. The current update uses tag `v0.3.0`, with numeric webOS app package version `0.3.0`. The unchanged native helper remains `0.1.0`.
2. Run `npm ci --ignore-scripts`, `npm test` and `npm run check`. Inspect dependency advisories separately; do not force dependency upgrades.
3. With Python 3 available, run `npm run release`. If needed set `PYTHON` to its executable. This command only produces local files; it does not publish.
4. Inspect the actual source archive and sample IPK, including their manifests. Confirm the sample connection is empty and the source contains no private builds, credentials, pairing material, real household profiles or development-import scripts. Inspect screenshots manually too.
5. Check that README images, relative links, badges, release notes, licensing and support links render correctly. Include only observed validation claims.

## Keep public source separate

The source ZIP is generated from `publicFiles()` in scripts/check.cjs. That list includes app, wizard, helper source, docs/images, tests, scripts, blueprints, GitHub templates/workflows and named top-level project files. It excludes private, evidence, installed dependencies, native build caches and development-only import/edit scripts.

For a first publication, use a new clean Git working directory populated **only** with that reviewed public file list. For later updates, compare the list against the existing repository, preserve history, and review removals explicitly. Never run a broad `git add .` from a household project workspace. `.gitignore` does not untrack a previously committed secret.

Push the reviewed commit to GitHub and wait for the validation workflow on that exact commit. A workflow definition is not evidence of a completed run. GitHub Actions tests on Windows, macOS and Linux are build/unit coverage, not a physical TV or desktop-GUI acceptance test.

## Publish a release

Create the release as a draft first, targeting the reviewed commit, with **pre-release** disabled for a regular release and the notes from docs/RELEASE-NOTES.md. Upload only:

- `LG-TV-HA-Home-Launcher-0.3.0-source.zip`
- `com.mbs.communityhome_0.3.0_SAMPLE_all.ipk`
- `LG-TV-HA-Home-Launcher-designs.png`
- `LG-TV-HA-Home-Launcher-themes.jpg`
- `LG-TV-HA-Home-Launcher-update-0.3.jpg`
- `SHA256SUMS.txt`

The release directory may contain local review records; they are not release assets. Files under private/builds and private/helper-builds are never selected, even if their filenames resemble a public asset.

Before making the draft visible, check the release title/tag, target commit, pre-release status, notes and six asset names. On publication, read back the repository and release metadata, then download the published assets to a separate local verification folder and compare their SHA-256 hashes with the reviewed local files. Open the rendered README and release page to check images, buttons and navigation.

Use normal versioned corrections for later problems; do not silently replace a published asset with different bytes. Preserve a release record with commit, tag, asset hashes, CI result and remaining validation limits.

## Repository settings

Use the project description and MBS Integrations homepage, relevant webOS/HA topics, Issues for sanitized reports, and the supplied issue/PR templates. The README includes validation, release, GPL licence, GitHub stars and PayPal buttons. The PayPal destination matches the LG Camera Overlay project. Keep private vulnerability reporting enabled when supported.

Do not enable a public configurator service or GitHub Pages token-entry page: setup runs locally on each user's computer. Publishing this source does not authorize changing an owner's TVs or HA configuration.
