# Active Context — chore/apk-github-release: APK Auto-Release to GitHub

## Context

The VistaFi mobile app builds a preview APK via EAS, but the artifact only lives on expo.dev.
This task adds a `mobile-release.yml` GitHub Actions workflow that:
1. Gates on type-check + unit tests passing
2. Triggers an EAS preview APK build
3. Downloads the APK from EAS
4. Creates a GitHub Release and attaches the APK

Branch: `chore/apk-github-release`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Update `docs/active-context.md` | ✅ |
| 2 | Create `.github/workflows/mobile-release.yml` | ✅ |
| 3 | Security compliance check | ✅ |
| 4 | Commit + push | ⬜ |

---

## Files Changed

- `docs/active-context.md` — this file
- `.github/workflows/mobile-release.yml` — new workflow: EAS build → GitHub Release

## Files NOT Changed

- `.github/workflows/mobile-ci.yml` — unchanged; keeps running on every push/PR
- `mobile/eas.json` — already configured with `preview` profile + `"environment": "preview"`
- All source `.tsx`/`.ts` — no code changes needed

---

## Security Decisions

| Decision | Rationale |
|----------|-----------|
| `permissions: {}` at workflow level | Restricts all by default; each job opts in explicitly |
| `test` job: `contents: read` only | No release creation needed |
| `build-and-release` job: `contents: write` only | Minimum for GitHub Release creation |
| Supabase env vars NOT passed to EAS build | EAS fetches them from its own `preview` environment (eas.json `"environment": "preview"`) |
| Supabase env vars passed only to `test` job | Unit tests need them locally because `supabase.ts` runs `createClient` at module load |
| `EXPO_TOKEN: ${{ secrets.EAS_TOKEN }}` | Only secret the EAS build step needs; stored in GitHub Secrets |
| `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}` | Built-in; no user setup required |
| Preview APK, not production | `distribution: internal`; acceptable for GitHub Releases |
| Error guard on APK URL extraction | Fails fast and loudly if EAS output format changes |

## GitHub Secret Required (user sets once)

- `EAS_TOKEN` — Expo personal access token (expo.dev → Account Settings → Access Tokens)

---

## How to Trigger a Release

```bash
# Tag a commit and push — workflow fires automatically
git tag v1.0.0
git push origin v1.0.0
```

Or: GitHub Actions → Mobile Release workflow → Run workflow (manual dispatch).
