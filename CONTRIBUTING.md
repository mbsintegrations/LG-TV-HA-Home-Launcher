# Contributing

Start with [development](docs/DEVELOPMENT.md) and [validation](docs/VALIDATION.md). Use fictional entities and synthetic credentials in tests. Never attach a configured IPK, HA token, pairing key or household profile to a pull request.

For a change, create a descriptive temporary branch from current `main`, keep the diff focused, run `npm test` and `npm run check`, and describe the observed behavior and validation limits. Run a fresh sample build if changing packaged app files. Preserve ES5 syntax in TV/old-Node code, explicit device targets, the LG Home escape path, and native helper safety checks. A modern desktop browser passing is not sufficient evidence of old-TV compatibility.

Submit changes through a pull request against `main`, including documentation and artwork. Wait for checks on the latest commit before merging, then remove the temporary branch. Maintainers follow the same [branch and pull-request workflow](docs/PUBLISHING.md#branch-and-pull-request-workflow).

Documentation and translations are welcome. Link primary sources for third-party installation steps. When reporting a TV, provide model, firmware and reported SDK separately, plus the exact community version tested. Clearly distinguish base app, startup automation and helper results.

Own code contributions are under GPL-3.0-only; retain upstream notices. See [licensing](docs/LICENSING.md). Do not make dependency major-version changes simply to silence audit warnings; explain compatibility and test impact first.
