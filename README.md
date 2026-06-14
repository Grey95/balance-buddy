# Balance Buddy

**AI Systems for Finance Professionals** — marketing site for an 8-week live AI cohort
aimed at finance pros (CA/CMA). Managed by **ai-training-nova** under Sidequest / Supernova.

- **Live:** https://aditya.quest (apex) — also https://balancebuddy-finance.netlify.app
- **Source:** `site/index.html` — a self-contained Claude/Figma-Make *bundle* (single
  ~2.9 MB file that base64+gzip-unpacks its assets to blob URLs in the browser). v0 ships
  it as-is. A future round can extract it into plain HTML/CSS for SEO + maintainability.

## Deploy

Netlify site `balancebuddy-finance` (id `079c6842-ab52-463e-8d12-624509bec048`).

> ⚠️ The parent Sidequest `.netlify/state.json` points at a different site. **Always run
> netlify from inside this folder** (a local `.netlify/state.json` pins the right site).

```bash
cd AI-TRAINING
netlify deploy --prod --dir site --site 079c6842-ab52-463e-8d12-624509bec048
```

## DNS (aditya.quest @ GoDaddy, external DNS)

| Type  | Name | Value                              |
|-------|------|------------------------------------|
| A     | `@`  | `75.2.60.5` (Netlify load balancer)|
| CNAME | `www`| `balancebuddy-finance.netlify.app.`|

Nameservers stay at GoDaddy (`ns51/52.domaincontrol.com`). Apex uses an A record because
GoDaddy has no ALIAS/ANAME. HTTPS is auto-provisioned by Netlify (Let's Encrypt).

## Nova

Ruflo handles execution; **ai-training-nova** owns memory, sessions, decisions, and spend
under `supernova/projects/ai-training/`.
