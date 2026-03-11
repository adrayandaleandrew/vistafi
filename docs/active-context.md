# Active Context — chore/android-apk-release: Automated APK Build → GitHub Releases

## Context

Automate the Android APK build via EAS and publish the artifact to GitHub Releases on every
semver tag push (`v*.*.*`). EAS `eas.json` already has a `preview` profile with
`"buildType": "apk"` and `"environment": "preview"` — Supabase keys are managed there, not
in GitHub Actions secrets. Only `EAS_TOKEN` is needed in the workflow.

Branch: `chore/android-apk-release`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Update `docs/active-context.md` | ✅ |
| 2 | Create `.github/workflows/android-release.yml` | ✅ |
| 3 | Update `.gitignore` — add `*.apk`, `*.ipa`, `*.aab`, signing artifact entries | ✅ |
| 4 | Commit `mobile/.env.local.example` (placeholder-only template) | ✅ |
| 5 | Security checklist (pre-push) | ✅ |
| 6 | Commit + push | ✅ |

---

## Files Changed

- `.github/workflows/android-release.yml` — new workflow (tag-triggered EAS build + release)
- `.gitignore` — added `*.apk`, `*.ipa`, `*.aab`, `google-services.json`, `GoogleService-Info.plist`
- `docs/active-context.md` — this file
- `mobile/.env.local.example` — committed (placeholder-only, safe)

## Files NOT Changed

- `mobile/eas.json` — `preview` profile already correct
- `mobile/app.json` — EAS projectId + android package already set
- All source `.tsx`/`.ts` — no code changes needed

---

## Security Decisions

- `EAS_TOKEN` only in workflow — Supabase keys in EAS "preview" environment, not CI
- `actions/checkout` pinned to commit SHA (SecurityGuide §11)
- `permissions: contents: write` only (minimum for GitHub Releases)
- Trigger on tag push (`v*.*.*`) + `workflow_dispatch` — NOT on `pull_request` (prevents fork exposure)
- APK downloaded to runner `/tmp/` — never touches git tree
- Keystore managed by EAS cloud — no local signing artifacts
- `*.apk`, `*.ipa`, `*.aab` added to `.gitignore`

---

## User Actions Required Before First Run

### 1. Add `EAS_TOKEN` to GitHub Secrets
GitHub → repo → Settings → Secrets and variables → Actions → New repository secret:
- Name: `EAS_TOKEN`
- Value: your Expo access token from expo.dev → Account → Access Tokens

### 2. Verify EAS Environment Variables Are Set
From `mobile/` directory:
```bash
eas env:list preview
```
Both `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` must appear.
If not, create them (from previous chore/apk-build):
```bash
eas env:create preview --name EXPO_PUBLIC_SUPABASE_URL --value "https://..." --visibility sensitive --scope project
eas env:create preview --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGc..." --visibility sensitive --scope project
```

### 3. Trigger a Release
```bash
git tag v1.0.0
git push origin v1.0.0
```
GitHub Actions runs → EAS builds APK → GitHub Release created with APK attached.
