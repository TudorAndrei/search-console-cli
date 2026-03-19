---
title: "Installation"
description: "How to set up the Search Console CLI."
---

Setting up `search-console-cli` is straightforward with Bun.

## Prerequisites

1.  **Bun 1.0 or higher.**
2.  **Google Cloud Service Account:** You need a JSON key file for a service account that has access to your Search Console properties. (See [Authentication](/getting-started/authentication) for details).

## Quick Start

The easiest way to get started is by using our built-in setup wizard:

```bash
bun install
bun run build
bun run dist/setup.js
```

The setup wizard will help you:
*   Configure your Service Account key path.
*   Validate your credentials.
*   Export the credentials path for your shell.

## Run Commands

```bash
search-console sites_list
search-console analytics_performance_summary --site-url https://example.com --days 28
```

### Environment Variables

The CLI looks for the following environment variables:

| Variable | Description |
| :--- | :--- |
| `GOOGLE_APPLICATION_CREDENTIALS` | Absolute path to your Google Service Account JSON key file. |

Export credentials before running commands:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
```
