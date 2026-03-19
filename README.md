# Google Search Console CLI (Bun)

A Bun-powered command line app for Google Search Console data, SEO diagnostics, and automation workflows.

## What it does

- Query Search Console analytics with filters and dimensions.
- Analyze trends, anomalies, drop attribution, and forecasts.
- Manage sites and sitemaps.
- Inspect indexing status and run PageSpeed checks.
- Generate SEO opportunity reports (striking distance, low CTR, cannibalization, quick wins).

## Prerequisites

- Bun installed (`bun --version`)
- A Google Cloud service account JSON key
- Service account added to your Search Console property

## Quick Start

1. Install dependencies:

```bash
bun install
```

2. Build:

```bash
bun run build
```

3. Run setup wizard:

```bash
bun run dist/setup.js
```

4. Export credentials path:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
```

5. Run a command:

```bash
bun run dist/index.js sites_list
```

## CLI Usage

```bash
search-console <command> [--flag value]
search-console <command> --input '{"key":"value"}'
```

### Examples

```bash
search-console sites_list
search-console analytics_performance_summary --site-url https://example.com --days 28
search-console analytics_query --input '{"siteUrl":"https://example.com","startDate":"2026-01-01","endDate":"2026-01-31","dimensions":["query"],"limit":10}'
search-console seo_quick_wins --site-url https://example.com --days 28 --min-impressions 100
```

### Command groups

- `sites_*`: list/add/delete/get properties
- `sitemaps_*`: list/submit/delete/get sitemaps
- `analytics_*`: query, summaries, trends, anomalies, advanced time-series
- `inspection_*`: URL indexing inspection
- `pagespeed_*`: Lighthouse and Core Web Vitals
- `seo_*`: opportunity and recommendation workflows
- `seo_primitive_*`: low-level utility SEO calculations
- `schema_validate`: Schema.org validation

## Development

```bash
bun run typecheck
bun run test
```

## License

MIT
