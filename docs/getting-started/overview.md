---
title: "Overview"
description: "What is search-console-cli?"
---

**search-console-cli** is an open-source Bun command line application that gives AI agents and developers direct, structured access to Google Search Console (GSC).

Unlike simple API wrappers, this project focuses on providing **SEO Intelligence Tools**. Instead of just asking an agent to "look at my data," you can give it tools to "find quick wins" or "detect traffic anomalies."

## Key Capabilities

*   **Advanced Analytics:** Go beyond basic queries with multi-dimensional analysis and rolling averages.
*   **SEO Insights:** Deterministic detection of cannibalization, Striking Distance keywords, and "Low-Hanging Fruit."
*   **Site Management:** List, add, and verify site properties.
*   **Sitemap Control:** List, submit, and delete sitemaps.
*   **URL Inspection:** Check the indexing status of individual pages.
*   **PageSpeed Integration:** Measure performance and Core Web Vitals directly within your SEO workflow.

## The Problem

Working with SEO data in LLMs usually involves:
1.  Exporting CSVs.
2.  Uploading them to a chat window.
3.  Hoping the model calculates standard deviations or trends correctly.

## The Solution

With this CLI, the agent has a "toolbox." When you ask "Why did my traffic drop?", the agent doesn't guess. It calls `analytics_time_series` to check for anomalies, `inspect_url` to see if pages were de-indexed, and `seo_insights` to check for ranking shifts.

## Supported Environments

This CLI works directly in your terminal and can be orchestrated by coding agents and scripts.
