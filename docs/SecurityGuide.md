# What NOT to Expose in Your GitHub Repository

> **Project:** Financial Tracker · **Stack:** Web + Native Mobile · **DB:** Supabase

---

## Table of Contents

1. [Credentials & Secrets](#1-credentials--secrets)
2. [Supabase-Specific Risks](#2-supabase-specific-risks)
3. [Mobile App Vulnerabilities](#3-mobile-app-vulnerabilities)
4. [Source Code Risks](#4-source-code-risks)
5. [Repository & Git History](#5-repository--git-history)
6. [Infrastructure & Configuration Files](#6-infrastructure--configuration-files)
7. [Data & Privacy Exposure](#7-data--privacy-exposure)
8. [Dependency & Supply Chain Risks](#8-dependency--supply-chain-risks)
9. [API & Endpoint Design Risks](#9-api--endpoint-design-risks)
10. [Real-Time Sync Security (Web ↔ Mobile)](#10-real-time-sync-security-web--mobile)
11. [CI/CD Pipeline Security](#11-cicd-pipeline-security)
12. [Financial App-Specific Risks](#12-financial-app-specific-risks)
13. [Pre-Push Audit Checklist](#13-pre-push-audit-checklist)

---

## 1. Credentials & Secrets

> The most obvious but most commonly leaked category.

### 🔴 Authentication Keys

| Secret | Risk | Why It's Dangerous |
|--------|------|--------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | **CRITICAL** | Bypasses all Row Level Security. Full read/write/delete on your entire DB. Treat like a root password. Never use client-side. |
| `SUPABASE_JWT_SECRET` | **CRITICAL** | Used to sign auth tokens. If leaked, attackers can forge valid JWTs, impersonate your account, and access all financial data without your password. |
| `SUPABASE_ANON_KEY` | **HIGH** | "Anon" is misleading — with weak or missing RLS, anyone can query your tables directly via the REST API using this key. |
| Database Connection String | **HIGH** | The direct PostgreSQL URI bypasses Supabase's auth layer entirely. Exposure = direct DB access with full SQL privileges. |
| OAuth Client Secrets | **HIGH** | If using Google/Apple Sign-In, the client secret lets attackers impersonate your app to the OAuth provider and intercept auth codes. |
| Payment API Keys (Stripe, PayMongo, etc.) | **HIGH** | Secret keys can initiate charges, issue refunds, or read transaction histories. |

### 🔴 Environment Files

Never commit any of these files:

```
.env
.env.local
.env.development
.env.staging
.env.production
.env.test
.env.example  ← only safe if it contains placeholder values, not real ones
```

**`.gitignore` rule:**

```gitignore
.env
.env.*
!.env.example   # Only allow the example template
```

---

## 2. Supabase-Specific Risks

> Beyond just keeping keys secret — how your Supabase setup itself can be exploited.

### 🔴 Missing or Misconfigured Row Level Security (RLS) — CRITICAL

This is a **design vulnerability**, not just a secret leak. If RLS is disabled on any table, anyone with your anon key can query it directly via the Supabase REST API. Every table must have RLS enabled with policies tied to your authenticated user ID.

```sql
-- Enable RLS on every table
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Policy: only the owner can see and modify their data
CREATE POLICY "Owner access only"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

> **Audit query:** Run this in your Supabase SQL editor to check which tables have RLS enabled:
> ```sql
> SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
> ```

### 🟠 Exposed Database Schema in Code or Comments — HIGH

Committing your exact table names, column names, foreign key structure, or migration files reveals your schema. Attackers can craft targeted REST API queries against it. Keep migration files out of public repos or use abstract naming.

### 🟠 Supabase Project URL as a Configuration Clue — HIGH

Your project URL (e.g. `https://xyzabc.supabase.co`) is embedded in the subdomain. Combined with a weak anon key and no RLS, the URL is the only thing an attacker needs. Use environment variables even for the URL.

### 🟡 Storage Bucket Permissions Set to Public — MEDIUM

If you store receipts, export files, or profile data in Supabase Storage with the bucket set to **public**, anyone can access those files by URL without authentication. Use private buckets with signed URLs for all financial documents.

### 🟡 Realtime Channel Subscriptions Without Auth Filtering — MEDIUM

Supabase Realtime lets clients subscribe to DB changes. If your channel is not filtered to your `user_id`, other users could receive your transaction updates in real time.

```js
// ❌ Dangerous — subscribes to ALL changes on the table
supabase.channel('transactions').on('postgres_changes', ...)

// ✅ Correct — filter to only your user's rows
supabase.channel('transactions')
  .on('postgres_changes', {
    event: '*', schema: 'public', table: 'transactions',
    filter: `user_id=eq.${userId}`
  }, handleChange)
```

### 🟡 Postgres RPC Functions Without Security Definer Caution — MEDIUM

Functions with `SECURITY DEFINER` that don't validate `auth.uid()` inside the function body can be called with elevated privileges. Always validate the caller's identity inside every RPC function.

---

## 3. Mobile App Vulnerabilities

> Native mobile apps have additional attack surfaces beyond the web.

### Build Artifacts & Signing

| File | Risk | Danger |
|------|------|--------|
| Android Keystore (`.jks` / `.keystore`) + password | **CRITICAL** | Allows publishing fake versions of your app to the Play Store under your identity. |
| `google-services.json` | **CRITICAL** | Contains Firebase project ID and billable API keys. Can be abused even if you only use it for Google Sign-In or push notifications. |
| `GoogleService-Info.plist` | **CRITICAL** | iOS equivalent of `google-services.json`. Same abuse vector. |
| Apple certs & provisioning profiles (`.p12`, `.cer`, `.mobileprovision`) | **HIGH** | Can be used to sideload malicious apps or impersonate your app identity. Use Fastlane Match or Xcode Cloud instead. |

```gitignore
# .gitignore — mobile signing artifacts
*.jks
*.keystore
*.p12
*.cer
*.mobileprovision
google-services.json
GoogleService-Info.plist
ios/certs/
```

### Hardcoded Values in Mobile Source Code

**🔴 CRITICAL — API Keys Hardcoded in Source Files**

Mobile apps get decompiled. Android APKs can be reverse-engineered with `jadx` or `apktool` in minutes. iOS IPAs can be analyzed with `class-dump` and Hopper. Any secret you hardcode will be extracted.

```js
// ❌ Visible to anyone who decompiles your APK/IPA
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// ✅ React Native — inject at build time via react-native-config
import Config from 'react-native-config'
const SUPABASE_KEY = Config.SUPABASE_ANON_KEY

// ✅ Expo — use EAS Secrets + expo-constants
import Constants from 'expo-constants'
const SUPABASE_KEY = Constants.expoConfig.extra.supabaseAnonKey

// ✅ Flutter — use --dart-define at build time
const supabaseKey = String.fromEnvironment('SUPABASE_KEY')
```

**🟠 Hardcoded Test Credentials — HIGH**

Test accounts with real passwords, seeded user data with your actual email, or `// TODO: remove test login` blocks left in. Decompilation reveals these immediately.

**🟡 Internal API Endpoint URLs and IPs — MEDIUM**

Internal staging URLs, admin dashboard endpoints, or dev server IPs hardcoded in mobile source reveal your infrastructure topology and may be accessible without auth in dev environments.

**🟡 Insecure Local Storage of Tokens on Device — MEDIUM**

Never store auth tokens in `AsyncStorage` (React Native) or `SharedPreferences` (Android) unencrypted. Use the Keychain/Keystore via:
- `expo-secure-store` (Expo)
- `react-native-keychain` (React Native)
- `flutter_secure_storage` (Flutter)

---

## 4. Source Code Risks

> Vulnerabilities that live in your code logic, not just config files.

### 🟠 Client-Side Balance Calculations — HIGH

If your app calculates the balance on the client side and writes the result back to the database, an attacker can intercept and modify the value before it's saved. **Always compute balances server-side.**

```sql
-- ✅ Let Postgres calculate the balance via a trigger
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE accounts
  SET balance = (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions
    WHERE account_id = NEW.account_id
      AND user_id = auth.uid()
  )
  WHERE id = NEW.account_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 🟠 Verbose Error Messages Exposing Internals — HIGH

Errors like `"column 'user_id' of relation 'transactions' does not exist"` reveal your schema, framework versions, and file paths. In production, return generic errors to clients and log detailed errors server-side only.

### 🟠 Debug Logging of Sensitive Data — HIGH

```js
// ❌ Never do this in production code
console.log("User token:", session.access_token)
console.log("Transaction:", { amount: 5000, account: "BDO Savings" })

// ✅ Use a logger with levels and redaction
logger.debug("Transaction recorded", { id: txn.id }) // ID only, no amounts
```

Mobile device logs can be read by other apps on older Android versions and via connected debuggers. Use a log level system and strip sensitive fields before logging.

### 🟡 Commented-Out Credentials or Old API Keys — MEDIUM

Developers often comment out old keys during rotation. These still appear in git history and in the committed file. Remove them entirely, then purge from git history.

### 🟡 TODO / FIXME Comments Revealing Security Gaps — MEDIUM

Comments like `// TODO: add authentication check here` or `// FIXME: anyone can delete transactions` are a map for attackers in a public repo. Fix the issue before committing, or use a private issue tracker instead.

---

## 5. Repository & Git History

> Even deleted files remain in git history forever unless explicitly purged.

### 🔴 Secrets Already Committed to History — CRITICAL

Deleting a file and committing the deletion does **not** remove it from git history. Anyone who clones your repo and runs `git log` or `git show` can still access old commits.

```bash
# Audit — find where secrets were ever committed
git log --all --full-history -- "**/.env*"
git grep -r "service_role" $(git rev-list --all)

# Purge a file from ALL history (run BEFORE pushing publicly)
pip install git-filter-repo
git filter-repo --path .env --invert-paths

# After purging, force-push all branches
git push origin --force --all
```

> ⚠️ **Assume any secret ever committed is compromised.** Rotate it immediately in Supabase, your OAuth provider, and any other service — even after purging history.

### 🟠 Branch Names and Commit Messages Leaking Context — HIGH

Branch names like `fix/admin-bypass-bug` or commit messages like `"temp: disable auth check for testing"` tell attackers exactly where to look for vulnerabilities. Keep security fix commit messages non-revealing.

### 🟠 Release Binaries With Embedded Secrets — HIGH

If you publish `.apk`, `.ipa`, or other binaries to GitHub Releases and those binaries were built with hardcoded secrets, the secrets are extractable from the binary. Never attach production builds to public repo releases.

### 🟡 Making a Private Repo Public Without Auditing History — MEDIUM

A very common mistake. If you started with a private repo and hardcoded secrets "temporarily", switching it to public exposes every commit ever made. Do a full secret scan before any visibility change.

```bash
# Install trufflehog and scan your entire repo history
pip install trufflehog
trufflehog git file://. --only-verified
```

---

## 6. Infrastructure & Configuration Files

> Config files that reveal your architecture or contain sensitive values.

### 🟠 Deployment Config With Real Values — HIGH

Files like `vercel.json`, `netlify.toml`, or `railway.json` should not contain hardcoded environment variables. Use the platform's secrets manager UI and reference secrets there. Committed deploy configs can expose project IDs, team tokens, or build hooks.

### 🟠 Docker Files With Baked-In Credentials — HIGH

```dockerfile
# ❌ Never do this in a Dockerfile
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsI...

# ✅ Pass it at runtime via --env-file or --secret
docker run --env-file .env.production myapp
```

### 🟡 Server Config Files With Internal IPs or Paths — MEDIUM

Nginx/Apache configs that reveal internal network topology, admin panel paths (e.g. `/admin_secret_path`), or backend service addresses. Sanitize before committing.

### 🟡 `.npmrc` or `.pypirc` With Auth Tokens — MEDIUM

Package registry config files can contain auth tokens for private npm packages or PyPI registries. These grant publish access under your identity.

```gitignore
.npmrc
.pypirc
.pip/
pip.conf
```

### 🟡 SSH Keys, PEM Files, and Cloud Keypairs — MEDIUM

```gitignore
*.pem
*.key
id_rsa
id_ed25519
.ssh/
```

Private SSH keys or cloud keypairs committed to a repo give full server access to anyone who finds them.

---

## 7. Data & Privacy Exposure

> Protecting real data — especially your own financial records.

### 🔴 Real Financial Data in Seed Files or Fixtures — CRITICAL

Database seed files (`seed.sql`, `fixtures.json`) or test data files containing your real transaction amounts, account names, or balances must never be committed. Use **fully fictional data** for seeds. Never export your real DB and commit it.

### 🟠 Database Exports / Backup Files — HIGH

SQL dumps, CSV exports, or JSON backups of your financial data are often generated locally for debugging and accidentally committed.

```gitignore
*.sql
*.dump
*.bak
*.backup
exports/
backups/
```

### 🟠 Screenshots or Images With Sensitive Info in Docs — HIGH

Screenshots in `/docs` or `README.md` that show real account balances, transaction amounts, or personal details. Always use blurred, redacted, or fully fictional data in documentation visuals.

### 🟡 Analytics or Tracking IDs — MEDIUM

Google Analytics measurement IDs, Mixpanel tokens, Sentry DSN URLs, or Crashlytics keys. While not directly exploitable, they can be abused to inject fake events into your analytics or spam your error tracker.

---

## 8. Dependency & Supply Chain Risks

> Threats that come from your dependencies, not your own code.

### 🟠 Committing `node_modules` or `vendor` Directories — HIGH

These should never be committed. They bloat the repo, can contain platform-specific binaries, and mask which version of each package is actually being used. Use `package-lock.json` or `yarn.lock` for reproducible installs.

### 🟠 Outdated Dependencies With Known CVEs — HIGH

For a financial app, a compromised dependency could silently exfiltrate data. Run regularly:

```bash
npm audit
npm audit fix

# Deeper check
npx snyk test
```

### 🟡 Unpinned Dependency Versions — MEDIUM

Using `"^1.0.0"` or `"*"` in `package.json` means future (potentially malicious) versions can be pulled automatically. Pin critical packages to exact versions — especially auth and cryptography libraries.

```json
// ❌ Unpinned — future versions auto-install
"@supabase/supabase-js": "^2.0.0"

// ✅ Pinned — you control every update explicitly
"@supabase/supabase-js": "2.39.3"
```

### 🟡 Local Dependency Patches Not Committed — MEDIUM

If you patch a dependency via `patch-package` but don't commit the patch file, a fresh install silently reverts the fix. Always commit patch files and document why the patch exists.

---

## 9. API & Endpoint Design Risks

> How your API can be exploited even without leaked credentials.

### 🟠 No Rate Limiting on Auth Endpoints — HIGH

Supabase auth endpoints can be brute-forced without rate limiting. Enable CAPTCHA (hCaptcha/Turnstile) on sign-in flows and configure rate limits in the Supabase Dashboard under **Auth → Rate Limits**.

### 🟠 Overly Permissive CORS Configuration — HIGH

Setting `Access-Control-Allow-Origin: *` on any API or Edge Function handling financial data allows malicious websites to make cross-origin requests.

```js
// Supabase Edge Function — restrict CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourapp.com', // ✅ specific origin only
  // NOT: '*'  ❌
}
```

### 🟠 Supabase REST API Without Input Validation — HIGH

Supabase's auto-generated REST API accepts complex filter parameters. Without proper RLS policies, crafted queries might return unintended data. Validate and sanitize all user inputs before they reach your DB layer.

### 🟡 Predictable or Sequential Resource IDs — MEDIUM

Using auto-increment integer IDs (1, 2, 3…) for transactions allows enumeration attacks. Use UUIDs (v4) for all primary keys — Supabase supports this natively with `gen_random_uuid()`.

### 🟡 Missing HTTP Security Headers — MEDIUM

```json
// vercel.json — security headers
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "X-Frame-Options", "value": "DENY" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Content-Security-Policy",
        "value": "default-src 'self'; connect-src 'self' https://*.supabase.co" }
    ]
  }]
}
```

---

## 10. Real-Time Sync Security (Web ↔ Mobile)

> Specific to your architecture: keeping the web ↔ mobile sync secure.

Your core feature — changes on web instantly reflecting on mobile — introduces specific security considerations around real-time channels and session management.

### 🟠 Session Token Not Refreshed on Mobile After Web Activity — HIGH

Supabase JWTs expire. If your mobile app holds a stale token after your web session was refreshed or invalidated (e.g., password change), the mobile app may operate on an old session. Always handle token refresh events.

```js
// Listen for session changes on mobile
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear local state, redirect to login
  }
  if (event === 'TOKEN_REFRESHED') {
    // Store new token securely via Keychain/Keystore
  }
})
```

### 🟠 No Mechanism to Invalidate All Sessions — HIGH

If your account is compromised, you need to sign out of all devices simultaneously. Implement this in both web and mobile app settings:

```js
// Sign out of ALL devices (web + mobile)
await supabase.auth.signOut({ scope: 'global' })
```

### 🟡 Optimistic UI Updates Without Server Confirmation — MEDIUM

If the web app shows a transaction before the DB write confirms and the write fails without rolling back the UI, the displayed balance and actual DB balance diverge. Always confirm writes before updating state.

### 🟡 Realtime Presence Leaking Activity Metadata — MEDIUM

Supabase Realtime's Presence feature can broadcast when a user is active, revealing behavioral patterns (e.g., when you're actively managing finances). Only use Presence if you explicitly need it.

---

## 11. CI/CD Pipeline Security

> Your build and deployment pipeline is an attack surface too.

### 🔴 Secrets in GitHub Actions Workflow Files — CRITICAL

Hardcoding secrets in `.github/workflows/*.yml` is a critical mistake. Workflow files are public in a public repo.

```yaml
# ❌ Never hardcode in workflow files
env:
  SUPABASE_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ Use GitHub Encrypted Secrets
# (Settings → Secrets and variables → Actions)
env:
  SUPABASE_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### 🟠 Overly Permissive GitHub Actions Permissions — HIGH

Avoid `permissions: write-all`. A compromised action (e.g., via a malicious PR) with broad `GITHUB_TOKEN` scope could exfiltrate secrets or modify your repo. Use minimum required permissions per workflow job.

### 🟠 Using Unverified Third-Party Actions Without Pinning — HIGH

Using `uses: some-author/action@main` is a supply chain risk — the action can be updated to include malicious code. Always pin to a specific commit SHA:

```yaml
# ❌ Unpinned — can be silently updated with malicious code
uses: actions/checkout@main

# ✅ Pinned to a specific commit SHA
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
```

### 🟡 PR Workflows That Access Production Secrets — MEDIUM

If CI runs on pull requests from forks and has access to production secrets, a malicious PR can exfiltrate them. Never expose production secrets to fork-based PRs. Use `pull_request_target` carefully.

---

## 12. Financial App-Specific Risks

> Beyond generic security — risks unique to apps that track money.

### 🟠 No Transaction Integrity / Audit Trail — HIGH

Financial apps should maintain an immutable log of all changes. Implement an audit log table that records every INSERT, UPDATE, DELETE on financial tables.

```sql
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL,       -- 'INSERT', 'UPDATE', 'DELETE'
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 🟠 Amount Fields Stored as Floats — HIGH

Floating-point arithmetic causes rounding errors. `0.1 + 0.2 ≠ 0.3` in most languages. Always store amounts as integers (cents/centavos) or use Postgres's `NUMERIC` type.

```sql
-- ❌ FLOAT loses precision on large amounts
amount FLOAT

-- ✅ Store as cents (integer) or use NUMERIC with fixed precision
amount_cents INTEGER NOT NULL    -- e.g. 10000 = ₱100.00
amount NUMERIC(15, 2) NOT NULL   -- or exact decimal type
```

### 🟡 No Soft Delete — Transactions Permanently Deleted — MEDIUM

Hard-deleting financial records makes it impossible to investigate discrepancies. Use a `deleted_at TIMESTAMPTZ` column for soft deletes. Filter deleted records in your RLS policies or views.

```sql
-- Add soft delete column
ALTER TABLE transactions ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

-- RLS policy that hides soft-deleted records
CREATE POLICY "Hide deleted"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);
```

### 🟡 Timestamps Without Timezone Awareness — MEDIUM

Storing timestamps as naive local time causes sync inconsistencies between web and mobile. Always use `TIMESTAMPTZ` in Postgres, store and compare in UTC, and convert to local time only at the display layer.

### 🟢 No Backup Strategy — LOW

Supabase provides daily backups on paid plans. Document or automate backup verification. For a personal financial tracker, losing your transaction history is significant — test your restore process periodically.

---

## 13. Pre-Push Audit Checklist

Run through this before every push to a public repository.

### Git & Secrets Scan

- [ ] Run `git diff --cached` and visually inspect everything being committed
- [ ] Run `trufflehog git file://. --only-verified` before pushing
- [ ] Verify `.env` and all secret files are in `.gitignore` and NOT staged
- [ ] Confirm no `*.pem`, `*.jks`, `*.keystore`, `google-services.json`, or `GoogleService-Info.plist` are staged
- [ ] Search staged files for `"supabase.co"`, `"service_role"`, `"eyJhbGc"` (JWT prefix)

### Code Review

- [ ] No `console.log` statements logging tokens, amounts, or user data
- [ ] No hardcoded credentials, even in test or commented-out code
- [ ] No TODO/FIXME comments revealing unpatched security issues
- [ ] Balance calculations happen server-side (trigger or RPC), not client-side

### Supabase Config

- [ ] RLS is enabled on every table (`rowsecurity = true` for all public schema tables)
- [ ] Realtime subscriptions are filtered by `user_id`
- [ ] Storage buckets containing financial data are set to private, not public
- [ ] Service role key is NOT used in any client-side (web or mobile) code

### Automation (Set Once, Runs Forever)

- [ ] Enable GitHub Secret Scanning (Settings → Security → Secret scanning)
- [ ] Add pre-commit hook with `git-secrets` or `detect-secrets` to block accidental commits
- [ ] Enable Dependabot alerts for vulnerable dependencies
- [ ] Add `npm audit` step to your CI pipeline

```bash
# Install a pre-commit secret scanner
pip install detect-secrets
detect-secrets scan > .secrets.baseline
detect-secrets audit .secrets.baseline

# Add to .git/hooks/pre-commit:
detect-secrets-hook --baseline .secrets.baseline
```

---

## Master `.gitignore` Template

```gitignore
# ── Environment & Secrets ──────────────────────────────────────
.env
.env.*
!.env.example

# ── Mobile Signing ─────────────────────────────────────────────
*.jks
*.keystore
*.p12
*.cer
*.mobileprovision
google-services.json
GoogleService-Info.plist
ios/certs/

# ── Certificates & Keys ────────────────────────────────────────
*.pem
*.key
id_rsa
id_ed25519
.ssh/

# ── Dependencies ───────────────────────────────────────────────
node_modules/
vendor/

# ── Package Registry Configs ───────────────────────────────────
.npmrc
.pypirc

# ── Database / Data Exports ────────────────────────────────────
*.sql
*.dump
*.bak
*.backup
exports/
backups/

# ── Build Artifacts ────────────────────────────────────────────
dist/
build/
*.apk
*.ipa
*.aab
```

---

*Keep this document updated as your stack evolves. Security is an ongoing process, not a one-time checklist.*