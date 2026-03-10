# Active Context — chore/apk-build: APK Build via EAS Build

## Context

The VistaFi mobile app (Expo SDK 54, React Native 0.81.5) needs a distributable Android APK
for sideloading / device testing. EAS Build is already configured — `mobile/eas.json` has a
`preview` profile with `"buildType": "apk"` and `app.json` already has a registered EAS
projectId. Two code changes are needed before triggering the build.

Branch: `chore/apk-build`

---

## Tasks

| # | Task | Status |
|---|------|--------|
| 1 | Update `docs/active-context.md` | ✅ |
| 2 | Add signing artifact patterns to `.gitignore` | ✅ |
| 3 | Add `android.package` to `mobile/app.json` | ✅ |
| 4 | Security checklist (pre-push) | ✅ |
| 5 | Commit + push | ✅ |

---

## Files Changed

- `.gitignore` — added `*.jks`, `*.keystore`, `*.p12`, `*.cer`, `*.mobileprovision`
- `mobile/app.json` — added `"android": { "package": "com.adrayandaleandrew.vistafi" }`
- `docs/active-context.md` — this file

## Files NOT Changed

- `mobile/eas.json` — `preview` profile already has `"buildType": "apk"`
- All source `.tsx`/`.ts` — no code changes needed for a build config task
- `.github/workflows/mobile-ci.yml` — CI-triggered EAS build is a future step (Phase 12c)

---

## User Actions Required (run manually in terminal)

### A. Install EAS CLI (once globally)
```bash
npm install -g eas-cli
eas --version   # must be >= 5.0.0
```

### B. Log in to Expo
```bash
eas login
eas whoami
```

### C. Set EAS Secrets (from `mobile/` directory)
```bash
cd mobile
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://YOUR_PROJECT.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGc...YOUR_ANON_KEY"
eas secret:list
```

### D. Trigger the APK build
```bash
cd mobile
eas build --platform android --profile preview
# Answer "Yes" to keystore generation on first run
```

### E. Download the APK
- expo.dev → Projects → vistafi → Builds → completed build → Download
- Or: `eas build:list --platform android --limit 3`

### F. Install on Android device
1. Transfer `.apk` to device
2. Settings → Security → Install Unknown Apps → enable
3. Open `.apk` → Install
