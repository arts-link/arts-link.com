# PostHog deploy tracking

This runbook covers the PostHog annotation that marks every successful production deploy of arts-link.com. It tells you how to set it up once, how to prove it works, how to fix it, and how to rotate its key.

**Source of truth:** `.github/workflows/posthog-deploy-annotation.yml` (its comment block holds the reasoning), `tests/posthog-deploy.test.js`.

## How it works

Production doesn't deploy from GitHub Actions. **Cloudflare Workers Builds** builds and deploys every push to `main`, then posts a check run called `Workers Builds: arts-link-com` back to the commit (see [`../deployment.md`](../deployment.md)). The workflow listens for that check run:

1. Workers Builds finishes a build and the check run completes.
2. The workflow carries on only if the check is `Workers Builds: arts-link-com`, its conclusion is `success`, **and** the commit is on `main`. A PR preview builds a branch commit that isn't on `main`, so it stops there.
3. It reads the commit's first line from GitHub and calls the official [`PostHog/posthog-github-action`](https://github.com/PostHog/posthog-github-action), pinned to v1.3.0 by commit, which creates a project annotation:

   ```
   arts-link.com production deploy @ <full SHA> · <short SHA> · <commit subject> · https://github.com/arts-link/arts-link.com/commit/<full SHA>
   ```

4. Before creating anything, the action searches for an annotation that starts with `arts-link.com production deploy @ <full SHA>`. If it finds one, it skips. That makes "Re-run jobs" and a Cloudflare build retry safe. The full SHA leads the text because the action matches on a prefix.

Nothing is annotated for PR previews, local builds, the `test` workflow, failed builds, or `npm run cf:deploy` from a laptop (that sends GitHub no check run). The deploy has already finished before this workflow starts, and the PostHog step is `continue-on-error`, so a PostHog failure can never fail or delay a deploy. It leaves a yellow warning on the run instead.

**Two keys, not to be confused.** The site already ships PostHog's **project API key** (`phc_…` in `config/production/hugo.toml`). It is public by design and can only send events. This feature uses a **Personal API Key** (`phx_…`), which can write to the project through PostHog's API. That key lives only in GitHub Actions secrets. Never put it in `config/`, `layouts/`, `static/`, a `.env` file, Cloudflare, or anywhere else the build reads. `tests/posthog-deploy.test.js` fails if the secret name or a `phx_` key appears in any of those, or in `public/`.

## Releases: evaluated, not enabled

Releases were evaluated but not enabled, for three reasons. PostHog releases exist to tie Error Tracking stack traces to the code that produced them, mostly through uploaded source maps. This site has none of the pieces that makes that useful:

- **Error Tracking isn't on.** Exception autocapture is off in the arts-link.com project (`autocapture_exceptions_opt_in` is unset), and nothing calls `captureException`. No exception would ever carry a release.
- **There is nothing to map.** No bundler and no source maps. The site's own JavaScript (`static/js/analytics.js`) ships unminified, so stack traces already point at real lines. `alpine.min.js` is vendored third-party code.
- **The annotation already does the correlation.** Its full SHA and commit link answer "what shipped when".

Revisit this if exception autocapture is turned on and the site gains bundled or minified first-party JS. At that point `PostHog/upload-source-maps` or `PostHog/resolve-release` needs a key with `error_tracking:write` and `organization:read`. Use a separate key, or add those scopes to this one.

## A. PostHog setup (once)

1. Sign in at **https://us.posthog.com** and switch to the **arts-link.com** project with the project switcher at top left. Don't use Chill-Dogs.com or benstrawbridge.com, which share the same organization.
2. **Find the Project ID.** Go to **Settings → Project → General**. The numeric **Project ID** is near the top. It is also the number in the URL, `us.posthog.com/project/<ID>/…`. For arts-link.com it is `355875`; check that it matches.
3. **Create a Personal API Key.** Click your avatar (bottom left) → **Account settings** → **Personal API keys** (`/settings/user-api-keys`) → **Create personal API key**.
   - **Label:** `GitHub Actions: arts-link.com deploy annotations`
   - **Organization & project access:** limit it to **Projects → arts-link.com** only.
   - **Scopes:** set **Annotation** to **Write** and leave everything else at **No access**. Write includes read, which the dedupe check uses to search existing annotations. Nothing else is needed, because releases aren't implemented.
4. **Copy the key now.** PostHog shows it once. Paste it straight into GitHub (step B). Don't save it in a note, a chat, or a file in this repository.
5. **Region/host:** this project is on **US Cloud**, so the app host is `https://us.posthog.com`. That is the workflow's default. It is **not** `https://g.arts-link.com` (the site's ingestion proxy) or `https://us.i.posthog.com` (event ingestion). The annotations API lives on the app host.

## B. GitHub setup (once)

Use **repository-level** settings on `arts-link/arts-link.com`. Only this repository deploys this site, and the client hub (`arts-link/clients.arts-link.com`) shouldn't be able to read a key that writes to the marketing site's PostHog project. An organization secret limited to one repository protects the key the same way. It just spreads its configuration across two settings pages.

1. Go to **github.com/arts-link/arts-link.com → Settings → Secrets and variables → Actions**.
2. **Secrets** tab → **New repository secret**
   - Name: `POSTHOG_CI_API_KEY`
   - Secret: the Personal API Key from A.4
3. **Variables** tab → **New repository variable**
   - Name: `POSTHOG_PROJECT_ID`
   - Value: `355875` (or whatever A.2 showed)
4. **`POSTHOG_HOST`: don't create it.** It is optional and only needed if the project ever moves off US Cloud (for example, set it to `https://eu.posthog.com`).

Until both the secret and `POSTHOG_PROJECT_ID` exist, each production deploy shows a "PostHog deploy annotation not configured" notice and creates nothing.

## C. Verification

1. Complete A and B.
2. Ship a harmless production change. Merging the PR that added this workflow is the first one. Otherwise, merge a one-word copy fix. The workflow only runs once its file is on `main`, because GitHub reads `check_run` workflows from the default branch.
3. On the merged commit, wait for **`Workers Builds: arts-link-com`** to go green. That is the deploy.
4. Open **Actions → PostHog deploy annotation**. Each check run on every commit starts a run, so expect several. The ones for `test` and for previews show the job as **skipped**, which is correct. Open the run for your commit whose `annotate` job ran.
5. In **Confirm production deploy**, check that the log says `vs main: identical` (or `behind`). **Create PostHog annotation** should be green and log `Created PostHog annotation: arts-link.com production deploy @ …`.
6. Open PostHog (arts-link.com project).
7. Open **Data management → Annotations** for the list. Then open a time series, for example **Product analytics → New insight → Trends** with `$pageview` over the last 24 hours, by hour.
8. Annotations show as small badges under the x-axis. If none appear, check that the insight's date range includes the deploy time.
9. Check that the badge sits at the deploy time. The action stamps the time it runs, usually under a minute after Cloudflare finishes. PostHog shows it in the project timezone (UTC).
10. Hover the badge and check the full SHA, short SHA, commit subject and link against the commit on GitHub.
11. Back in GitHub, open the same run and click **Re-run all jobs**. The step should now log `Annotation already exists, skipping: arts-link.com production deploy @ <SHA>`, and **Data management → Annotations** should still list one entry for that SHA.

## D. Troubleshooting

All PostHog errors show in the **Create PostHog annotation** step log, as `Failed to create annotation: <status> <detail>` or `Failed to list annotations: …`. A yellow "PostHog annotation failed" warning also appears on the run.

| Symptom | Cause and fix |
|---|---|
| `401` | The key is wrong, revoked or truncated. Create a new key (A.3) and replace the secret (B.2). |
| `403` / permission denied | The key lacks **Annotation: Write**, or isn't allowed into the arts-link.com project. Edit the key's scopes and project access in PostHog. |
| `404`, or annotations land in the wrong project | `POSTHOG_PROJECT_ID` is wrong. Recheck it against A.2. The value must be the number, not the project name or the `phc_` token. |
| `401`/`404` despite a correct key and ID | Wrong region. The project is US, so `POSTHOG_HOST` must be unset or `https://us.posthog.com`, never the `g.arts-link.com` proxy or an `*.i.posthog.com` ingestion host. |
| `annotate` job skipped on a production commit | The Workers Builds check didn't succeed (the deploy failed), or the commit isn't on `main`. Also, GitHub skips `check_run` workflows for commits pushed by GitHub Actions itself, such as `og-cards.yml` run on `main`. |
| Run says "not configured" | The secret or `POSTHOG_PROJECT_ID` is missing, or was created as an environment secret instead of a repository one. |
| Annotation created but not on the chart | The chart's date range doesn't cover the deploy, or the annotation is scoped elsewhere. It should say **Project** in **Data management → Annotations**. Hourly intervals make badges easier to place. |
| A rerun created a duplicate | The dedupe search failed and the action failed open; look for `Could not check for an existing annotation` in the log. Usually the key can't read annotations, so confirm **Annotation** is set to **Write**. Or someone edited the annotation text so it no longer starts with `arts-link.com production deploy @ <SHA>`. Delete the extra in **Data management → Annotations**. |
| PostHog failed but production is fine | Expected design. Production already deployed. Fix the cause, then **Re-run all jobs** on that run to backfill the marker (it gets the rerun time, not the deploy time). |
| The key name or a `phx_` key appears in `layouts/`, `static/`, `config/` or `public/` | Stop. Revoke the key in PostHog immediately (E.4), remove the reference, create a new key, and replace the secret. `npm test` fails on this. The key belongs only in `${{ secrets.POSTHOG_CI_API_KEY }}` inside the workflow. |

## E. Credential rotation

1. **Create the replacement.** In PostHog, go to **Account settings → Personal API keys → Create personal API key**, with the same label plus a date, the same project restriction, and **Annotation: Write** only.
2. **Replace the secret.** In GitHub, go to **Settings → Secrets and variables → Actions → `POSTHOG_CI_API_KEY` → Update secret**, and paste the new key.
3. **Test it.** Ship a harmless production change and run through C.4–C.10. Or rerun the latest production run of **PostHog deploy annotation**: a log line saying `Annotation already exists, skipping` proves the new key can read the project. Creating annotations still needs a real deploy to confirm.
4. **Revoke the old key.** In PostHog, go to **Personal API keys**, find the old label, and choose **Delete**. Do this only after step 3 passes.
