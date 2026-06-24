# Ahrefs Domain Rating Checker

Get free Domain Rating (DR) scores for any list of domains or URLs. Easily extract authoritative ranking metrics at scale to analyze and compare website backlink profile strength.

## Features

- **Bulk Lookup** — Check multiple domains and URLs in a single run.
- **Accurate Metric** — Retrieves authentic Domain Rating (DR) metrics on a 100-point logarithmic scale.
- **Clean Output** — Removes unnecessary data points, returning only clean and relevant information.
- **No Account Required** — Fetches domain authority scores without requiring an API key or subscription.

---

## Use Cases

### Competitor Intelligence
Analyze competitor domain strength in bulk. Identify high-authority websites in your niche and track how their backlink profiles change over time.

### Link Building Outreach
Evaluate the quality of potential backlink prospects. Filter out low-authority blogs and prioritize outreach to high-DR websites.

### SEO Audit & Reporting
Measure the authority of your portfolio of domains. Generate bulk reports for SEO clients to showcase website authority metrics clearly.

---

## Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `urls` | Array | Yes | — | List of domains or URLs to retrieve Domain Rating for. |
| `proxyConfiguration` | Object | No | — | Custom proxy settings to avoid rate limiting. |

---

## Output Data

Each item in the dataset contains the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `target` | String | The domain or URL checked. |
| `domain_rating` | Number | The Domain Rating score (0 to 100). |
| `license` | String | The URL of the data usage terms. |
| `attribution` | String | The required attribution text. |

---

## Usage Examples

### Basic Domain Search

Provide a list of root domains to retrieve authority scores:

```json
{
  "urls": [
    "google.com",
    "github.com"
  ]
}
```

### Full URL Search

Provide full URLs to automatically resolve and check their hostnames:

```json
{
  "urls": [
    "https://github.com/trending",
    "https://google.com/search"
  ]
}
```

---

## Sample Output

```json
{
  "target": "github.com",
  "domain_rating": 97,
  "license": "http://ahrefs.com/legal/domain-rating-license",
  "attribution": "Domain Rating by Ahrefs"
}
```

---

## Tips for Best Results

### Domain Verification
Ensure that input strings are correctly spelled domain names or URLs. Empty or invalid strings will be skipped automatically.

### Rate Limit Respect
For large lists of URLs, configure proxies to avoid target API rate limits and ensure smooth extraction.

---

## Integrations

Connect your domain rating data with:

- **Google Sheets** — Export directly for quick analysis.
- **Airtable** — Build searchable SEO databases.
- **Slack** — Get instant notifications for key metrics.
- **Webhooks** — Automate workflow triggers in external apps.

---

## Frequently Asked Questions

### What is Domain Rating?
Domain Rating (DR) shows the strength of a website's backlink profile on a logarithmic scale from 0 to 100.

### Can I input full URLs?
Yes, the actor accepts both raw domains and full URLs, extracting hostnames automatically.

---

## Support

For issues or feature requests, contact support through the Apify Console.

---

## Legal Notice

This actor is designed for legitimate data collection. Use of this data is subject to Ahrefs terms and requires proper attribution.