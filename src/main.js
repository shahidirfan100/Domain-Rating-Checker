import { Actor, log } from 'apify';
import { gotScraping } from 'got-scraping';

await Actor.init();

async function main() {
    try {
        const input = (await Actor.getInput()) || {};
        
        // Extract inputs with proper fallback priorities
        const rawUrls = [];
        if (Array.isArray(input.urls)) {
            rawUrls.push(...input.urls);
        } else if (typeof input.urls === 'string') {
            rawUrls.push(input.urls);
        }

        if (Array.isArray(input.startUrls)) {
            for (const entry of input.startUrls) {
                if (typeof entry === 'string') rawUrls.push(entry);
                else if (entry && typeof entry.url === 'string') rawUrls.push(entry.url);
            }
        }

        if (typeof input.startUrl === 'string') rawUrls.push(input.startUrl);
        if (typeof input.url === 'string') rawUrls.push(input.url);

        // Deduplicate and clean targets
        const targets = [...new Set(rawUrls
            .map(u => typeof u === 'string' ? u.trim() : '')
            .filter(Boolean)
        )];

        if (targets.length === 0) {
            log.warning('No targets or URLs provided in input. Exiting.');
            await Actor.exit();
            return;
        }

        log.info(`Found ${targets.length} unique targets to check.`);

        // Setup proxy configuration if provided
        let proxyConfiguration;
        if (input.proxyConfiguration && (input.proxyConfiguration.useApifyProxy || input.proxyConfiguration.proxyUrls)) {
            proxyConfiguration = await Actor.createProxyConfiguration(input.proxyConfiguration);
        }

        let processedCount = 0;
        const batchSize = 5; // Send requests in small batches for concurrency and safety

        for (let i = 0; i < targets.length; i += batchSize) {
            const batch = targets.slice(i, i + batchSize);
            const promises = batch.map(async (target) => {
                let proxyUrl;
                if (proxyConfiguration) {
                    proxyUrl = await proxyConfiguration.newUrl();
                }

                try {
                    log.info(`Checking Domain Rating for: ${target}`);
                    const response = await gotScraping({
                        url: `https://api.ahrefs.com/v3/public/domain-rating-free?target=${encodeURIComponent(target)}`,
                        headers: {
                            'Accept': 'application/json'
                        },
                        proxyUrl,
                        responseType: 'json',
                        timeout: { request: 15000 },
                        retry: { limit: 3 }
                    });

                    if (response.statusCode === 200 && response.body?.domain_rating) {
                        const drData = response.body.domain_rating;
                        
                        // Build clean item, omitting any null or undefined values
                        const item = {};
                        
                        item.target = target;
                        
                        if (drData.domain_rating !== null && drData.domain_rating !== undefined) {
                            item.domain_rating = drData.domain_rating;
                        }
                        if (drData.license) {
                            item.license = drData.license;
                        }
                        
                        // Add required attribution
                        item.attribution = 'Domain Rating by Ahrefs';

                        await Actor.pushData(item);
                        log.info(`Successfully retrieved DR ${drData.domain_rating} for ${target}`);
                        return true;
                    }
                    log.warning(`Failed to retrieve DR for ${target}: unexpected response structure`, response.body);
                } catch (err) {
                    log.error(`Error checking ${target}: ${err.message}`);
                }
                return false;
            });

            const results = await Promise.all(promises);
            processedCount += results.filter(Boolean).length;
            
            // Small delay between batches to respect rate limits
            if (i + batchSize < targets.length) {
                await new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            }
        }

        log.info(`Finished. Checked ${processedCount}/${targets.length} targets successfully.`);
    } catch (error) {
        log.error(`Actor execution failed: ${error.message}`);
    } finally {
        await Actor.exit();
    }
}

main().catch(err => {
    log.error('Fatal error:', err);
    process.exit(1);
});
