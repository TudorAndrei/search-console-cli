#!/usr/bin/env bun
import { z } from "zod";
import * as sites from "./tools/sites.js";
import * as sitemaps from "./tools/sitemaps.js";
import * as analytics from "./tools/analytics.js";
import * as inspection from "./tools/inspection.js";
import * as pagespeed from "./tools/pagespeed.js";
import * as seoInsights from "./tools/seo-insights.js";
import * as seoPrimitives from "./tools/seo-primitives.js";
import * as schemaValidator from "./tools/schema-validator.js";
import * as advancedAnalytics from "./tools/advanced-analytics.js";
import { starRepository } from "./tools/support.js";

type CommandHandler = (args: Record<string, unknown>) => Promise<unknown> | unknown;

interface CommandDefinition {
  description: string;
  schema: z.ZodObject<any>;
  run: CommandHandler;
}

const commands: Record<string, CommandDefinition> = {
  sites_list: {
    description: "List all sites in Search Console",
    schema: z.object({}),
    run: async () => sites.listSites(),
  },
  sites_add: {
    description: "Add a website to Search Console",
    schema: z.object({ siteUrl: z.string() }),
    run: async ({ siteUrl }) => sites.addSite(siteUrl as string),
  },
  sites_delete: {
    description: "Remove a website from Search Console",
    schema: z.object({ siteUrl: z.string() }),
    run: async ({ siteUrl }) => sites.deleteSite(siteUrl as string),
  },
  sites_get: {
    description: "Get information about a specific site",
    schema: z.object({ siteUrl: z.string() }),
    run: async ({ siteUrl }) => sites.getSite(siteUrl as string),
  },
  sitemaps_list: {
    description: "List sitemaps for a site",
    schema: z.object({ siteUrl: z.string() }),
    run: async ({ siteUrl }) => sitemaps.listSitemaps(siteUrl as string),
  },
  sitemaps_get: {
    description: "Get details about a specific sitemap",
    schema: z.object({ siteUrl: z.string(), feedpath: z.string() }),
    run: async ({ siteUrl, feedpath }) => sitemaps.getSitemap(siteUrl as string, feedpath as string),
  },
  sitemaps_submit: {
    description: "Submit a sitemap",
    schema: z.object({ siteUrl: z.string(), feedpath: z.string() }),
    run: async ({ siteUrl, feedpath }) => sitemaps.submitSitemap(siteUrl as string, feedpath as string),
  },
  sitemaps_delete: {
    description: "Delete a sitemap",
    schema: z.object({ siteUrl: z.string(), feedpath: z.string() }),
    run: async ({ siteUrl, feedpath }) => sitemaps.deleteSitemap(siteUrl as string, feedpath as string),
  },
  analytics_query: {
    description: "Query search analytics data with optional pagination",
    schema: z.object({
      siteUrl: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      dimensions: z.array(z.string()).optional(),
      type: z.enum(["web", "image", "video", "news", "discover", "googleNews"]).optional(),
      aggregationType: z.enum(["auto", "byProperty", "byPage"]).optional(),
      dataState: z.enum(["final", "all"]).optional(),
      limit: z.number().optional(),
      startRow: z.number().optional(),
      filters: z
        .array(
          z.object({
            dimension: z.string(),
            operator: z.string(),
            expression: z.string(),
          }),
        )
        .optional(),
    }),
    run: async (args) => analytics.queryAnalytics(args as any),
  },
  analytics_performance_summary: {
    description: "Get aggregate performance metrics for the last N days",
    schema: z.object({ siteUrl: z.string(), days: z.number().optional() }),
    run: async ({ siteUrl, days }) => analytics.getPerformanceSummary(siteUrl as string, days as number | undefined),
  },
  analytics_compare_periods: {
    description: "Compare performance metrics between two date periods",
    schema: z.object({
      siteUrl: z.string(),
      period1Start: z.string(),
      period1End: z.string(),
      period2Start: z.string(),
      period2End: z.string(),
    }),
    run: async ({ siteUrl, period1Start, period1End, period2Start, period2End }) =>
      analytics.comparePeriods(
        siteUrl as string,
        period1Start as string,
        period1End as string,
        period2Start as string,
        period2End as string,
      ),
  },
  analytics_top_queries: {
    description: "Get top search queries by clicks or impressions",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      limit: z.number().optional(),
      sortBy: z.enum(["clicks", "impressions"]).optional(),
    }),
    run: async ({ siteUrl, days, limit, sortBy }) =>
      analytics.getTopQueries(siteUrl as string, {
        days: days as number | undefined,
        limit: limit as number | undefined,
        sortBy: sortBy as "clicks" | "impressions" | undefined,
      }),
  },
  analytics_top_pages: {
    description: "Get top performing pages by clicks or impressions",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      limit: z.number().optional(),
      sortBy: z.enum(["clicks", "impressions"]).optional(),
    }),
    run: async ({ siteUrl, days, limit, sortBy }) =>
      analytics.getTopPages(siteUrl as string, {
        days: days as number | undefined,
        limit: limit as number | undefined,
        sortBy: sortBy as "clicks" | "impressions" | undefined,
      }),
  },
  analytics_by_country: {
    description: "Get performance breakdown by country",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      limit: z.number().optional(),
      sortBy: z.enum(["clicks", "impressions"]).optional(),
    }),
    run: async ({ siteUrl, days, limit, sortBy }) =>
      analytics.getPerformanceByCountry(siteUrl as string, {
        days: days as number | undefined,
        limit: limit as number | undefined,
        sortBy: sortBy as "clicks" | "impressions" | undefined,
      }),
  },
  analytics_search_appearance: {
    description: "Get performance breakdown by search appearance",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      limit: z.number().optional(),
      sortBy: z.enum(["clicks", "impressions"]).optional(),
    }),
    run: async ({ siteUrl, days, limit, sortBy }) =>
      analytics.getPerformanceBySearchAppearance(siteUrl as string, {
        days: days as number | undefined,
        limit: limit as number | undefined,
        sortBy: sortBy as "clicks" | "impressions" | undefined,
      }),
  },
  analytics_trends: {
    description: "Detect rising and declining traffic trends",
    schema: z.object({
      siteUrl: z.string(),
      dimension: z.enum(["query", "page"]).optional(),
      days: z.number().optional(),
      threshold: z.number().optional(),
      minClicks: z.number().optional(),
      limit: z.number().optional(),
    }),
    run: async ({ siteUrl, dimension, days, threshold, minClicks, limit }) =>
      analytics.detectTrends(siteUrl as string, {
        dimension: dimension as "query" | "page" | undefined,
        days: days as number | undefined,
        threshold: threshold as number | undefined,
        minClicks: minClicks as number | undefined,
        limit: limit as number | undefined,
      }),
  },
  analytics_anomalies: {
    description: "Identify unusual daily spikes or drops",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      threshold: z.number().optional(),
    }),
    run: async ({ siteUrl, days, threshold }) =>
      analytics.detectAnomalies(siteUrl as string, {
        days: days as number | undefined,
        threshold: threshold as number | undefined,
      }),
  },
  analytics_drop_attribution: {
    description: "Analyze whether drops are device or update related",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      threshold: z.number().optional(),
    }),
    run: async ({ siteUrl, days, threshold }) =>
      advancedAnalytics.analyzeDropAttribution(siteUrl as string, {
        days: days as number | undefined,
        threshold: threshold as number | undefined,
      }),
  },
  analytics_time_series: {
    description: "Get rolling averages, seasonality, and forecasts",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      dimensions: z.array(z.string()).optional(),
      metrics: z.array(z.enum(["clicks", "impressions", "ctr", "position"])).optional(),
      granularity: z.enum(["daily", "weekly"]).optional(),
      filters: z
        .array(
          z.object({
            dimension: z.string(),
            operator: z.string(),
            expression: z.string(),
          }),
        )
        .optional(),
      window: z.number().optional(),
      forecastDays: z.number().optional(),
    }),
    run: async ({ siteUrl, days, startDate, endDate, dimensions, metrics, granularity, filters, window, forecastDays }) =>
      advancedAnalytics.getTimeSeriesInsights(siteUrl as string, {
        days: days as number | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
        dimensions: dimensions as string[] | undefined,
        metrics: metrics as ("clicks" | "impressions" | "ctr" | "position")[] | undefined,
        granularity: granularity as "daily" | "weekly" | undefined,
        filters: filters as { dimension: string; operator: string; expression: string }[] | undefined,
        window: window as number | undefined,
        forecastDays: forecastDays as number | undefined,
      }),
  },
  inspection_inspect: {
    description: "Inspect URL indexing status and crawl information",
    schema: z.object({
      siteUrl: z.string(),
      inspectionUrl: z.string(),
      languageCode: z.string().optional(),
    }),
    run: async ({ siteUrl, inspectionUrl, languageCode }) =>
      inspection.inspectUrl(siteUrl as string, inspectionUrl as string, languageCode as string | undefined),
  },
  pagespeed_analyze: {
    description: "Run PageSpeed Insights for a URL",
    schema: z.object({
      url: z.string(),
      strategy: z.enum(["mobile", "desktop"]).optional(),
    }),
    run: async ({ url, strategy }) => pagespeed.analyzePageSpeed(url as string, (strategy as "mobile" | "desktop" | undefined) ?? "mobile"),
  },
  pagespeed_core_web_vitals: {
    description: "Get Core Web Vitals for mobile and desktop",
    schema: z.object({ url: z.string() }),
    run: async ({ url }) => pagespeed.getCoreWebVitals(url as string),
  },
  seo_recommendations: {
    description: "Generate high-level SEO recommendations",
    schema: z.object({ siteUrl: z.string(), days: z.number().optional() }),
    run: async ({ siteUrl, days }) => seoInsights.generateRecommendations(siteUrl as string, { days: days as number | undefined }),
  },
  seo_low_hanging_fruit: {
    description: "Find high-impression keywords in positions 5-20",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      minImpressions: z.number().optional(),
      limit: z.number().optional(),
    }),
    run: async ({ siteUrl, days, minImpressions, limit }) =>
      seoInsights.findLowHangingFruit(siteUrl as string, {
        days: days as number | undefined,
        minImpressions: minImpressions as number | undefined,
        limit: limit as number | undefined,
      }),
  },
  seo_cannibalization: {
    description: "Detect multiple pages competing for one query",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      minImpressions: z.number().optional(),
      limit: z.number().optional(),
    }),
    run: async ({ siteUrl, days, minImpressions, limit }) =>
      seoInsights.detectCannibalization(siteUrl as string, {
        days: days as number | undefined,
        minImpressions: minImpressions as number | undefined,
        limit: limit as number | undefined,
      }),
  },
  seo_low_ctr_opportunities: {
    description: "Find low CTR opportunities on page-one rankings",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      minImpressions: z.number().optional(),
      limit: z.number().optional(),
    }),
    run: async ({ siteUrl, days, minImpressions, limit }) =>
      seoInsights.findLowCTROpportunities(siteUrl as string, {
        days: days as number | undefined,
        minImpressions: minImpressions as number | undefined,
        limit: limit as number | undefined,
      }),
  },
  seo_striking_distance: {
    description: "Find keywords in positions 8-15",
    schema: z.object({ siteUrl: z.string(), days: z.number().optional(), limit: z.number().optional() }),
    run: async ({ siteUrl, days, limit }) =>
      seoInsights.findStrikingDistance(siteUrl as string, { days: days as number | undefined, limit: limit as number | undefined }),
  },
  seo_lost_queries: {
    description: "Find queries that dropped sharply or vanished",
    schema: z.object({ siteUrl: z.string(), days: z.number().optional(), limit: z.number().optional() }),
    run: async ({ siteUrl, days, limit }) =>
      seoInsights.findLostQueries(siteUrl as string, { days: days as number | undefined, limit: limit as number | undefined }),
  },
  seo_brand_vs_nonbrand: {
    description: "Split performance into brand and non-brand queries",
    schema: z.object({
      siteUrl: z.string(),
      brandRegex: z.string(),
      days: z.number().optional(),
    }),
    run: async ({ siteUrl, brandRegex, days }) =>
      seoInsights.analyzeBrandVsNonBrand(siteUrl as string, brandRegex as string, { days: days as number | undefined }),
  },
  seo_quick_wins: {
    description: "Find page-two ranking opportunities",
    schema: z.object({
      siteUrl: z.string(),
      days: z.number().optional(),
      minImpressions: z.number().optional(),
      limit: z.number().optional(),
    }),
    run: async ({ siteUrl, days, minImpressions, limit }) =>
      seoInsights.findQuickWins(siteUrl as string, {
        days: days as number | undefined,
        minImpressions: minImpressions as number | undefined,
        limit: limit as number | undefined,
      }),
  },
  seo_primitive_ranking_bucket: {
    description: "Get ranking bucket for a position",
    schema: z.object({ position: z.number() }),
    run: ({ position }) => seoPrimitives.getRankingBucket(position as number),
  },
  seo_primitive_traffic_delta: {
    description: "Calculate traffic delta and percentage",
    schema: z.object({ current: z.number(), previous: z.number() }),
    run: ({ current, previous }) => seoPrimitives.calculateTrafficDelta(current as number, previous as number),
  },
  seo_primitive_is_brand: {
    description: "Check whether query is brand-matching",
    schema: z.object({ query: z.string(), brandRegex: z.string() }),
    run: ({ query, brandRegex }) => seoPrimitives.isBrandQuery(query as string, brandRegex as string),
  },
  seo_primitive_is_cannibalized: {
    description: "Check whether two pages cannibalize one query",
    schema: z.object({
      query: z.string(),
      pageA_position: z.number(),
      pageA_impressions: z.number(),
      pageA_clicks: z.number(),
      pageB_position: z.number(),
      pageB_impressions: z.number(),
      pageB_clicks: z.number(),
    }),
    run: ({ query, pageA_position, pageA_impressions, pageA_clicks, pageB_position, pageB_impressions, pageB_clicks }) =>
      seoPrimitives.isCannibalized(
        query as string,
        {
          position: pageA_position as number,
          impressions: pageA_impressions as number,
          clicks: pageA_clicks as number,
        },
        {
          position: pageB_position as number,
          impressions: pageB_impressions as number,
          clicks: pageB_clicks as number,
        },
      ),
  },
  schema_validate: {
    description: "Validate Schema.org structured data",
    schema: z.object({
      type: z.enum(["url", "html", "json"]),
      data: z.string(),
    }),
    run: async ({ type, data }) => schemaValidator.validateSchema(data as string, type as "url" | "html" | "json"),
  },
  util_star_repo: {
    description: "Star the GitHub repository",
    schema: z.object({}),
    run: async () => starRepository(),
  },
};

function toCamelCase(key: string): string {
  return key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function coerceValue(value: string): unknown {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]"))) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

function parseFlags(tokens: string[]): Record<string, unknown> {
  const parsed: Record<string, unknown> = {};

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (!token.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${token}`);
    }

    const withoutPrefix = token.slice(2);
    const [rawKey, inlineValue] = withoutPrefix.split("=", 2);
    const key = toCamelCase(rawKey);
    const valueToken = inlineValue ?? tokens[i + 1];

    let value: unknown;
    if (inlineValue !== undefined) {
      value = coerceValue(inlineValue);
    } else if (!valueToken || valueToken.startsWith("--")) {
      value = true;
    } else {
      value = coerceValue(valueToken);
      i += 1;
    }

    if (parsed[key] === undefined) {
      parsed[key] = value;
    } else if (Array.isArray(parsed[key])) {
      (parsed[key] as unknown[]).push(value);
    } else {
      parsed[key] = [parsed[key], value];
    }

    i += 1;
  }

  return parsed;
}

function printUsage(): void {
  console.log("Google Search Console CLI (Bun)");
  console.log("\nUsage:");
  console.log("  search-console <command> [--flag value]");
  console.log("  search-console <command> --input '{\"key\":\"value\"}'");
  console.log("\nExamples:");
  console.log("  search-console sites_list");
  console.log("  search-console analytics_performance_summary --site-url https://example.com --days 28");
  console.log("  search-console analytics_query --input '{\"siteUrl\":\"https://example.com\",\"startDate\":\"2026-01-01\",\"endDate\":\"2026-01-31\",\"dimensions\":[\"query\"],\"limit\":10}'");
  console.log("\nCommands:");

  const rows = Object.entries(commands)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, command]) => `  ${name.padEnd(32, " ")} ${command.description}`);

  for (const row of rows) {
    console.log(row);
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const commandName = argv[0];

  if (!commandName || commandName === "help" || commandName === "--help" || commandName === "-h") {
    printUsage();
    return;
  }

  const command = commands[commandName];
  if (!command) {
    console.error(`Unknown command: ${commandName}`);
    console.error("Run `search-console --help` to view available commands.");
    process.exit(1);
  }

  try {
    const flags = parseFlags(argv.slice(1));
    const input = typeof flags.input === "string" ? JSON.parse(flags.input) : flags.input;
    const payload = {
      ...(input && typeof input === "object" ? (input as Record<string, unknown>) : {}),
      ...flags,
    };

    delete payload.input;

    const parsed = command.schema.safeParse(payload);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`).join("\n");
      console.error(`Invalid arguments for ${commandName}:\n${details}`);
      process.exit(1);
    }

    const result = await command.run(parsed.data);
    if (typeof result === "string") {
      console.log(result);
      return;
    }
    console.log(JSON.stringify(result ?? { ok: true }, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Command failed: ${message}`);
    process.exit(1);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exit(1);
});
