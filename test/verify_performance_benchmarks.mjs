import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

describe('DiasporaVerify Performance Optimization & Lighthouse Benchmarks', () => {
  const distPath = path.resolve('dist');
  const distAssetsPath = path.join(distPath, 'assets');
  const indexHtmlPath = path.resolve('index.html');
  const vercelJsonPath = path.resolve('vercel.json');

  test('Benchmark 1: Monolithic Bundle Eliminated & Code Splitting Verified', () => {
    assert.ok(fs.existsSync(distAssetsPath), 'Dist assets directory must exist (run npm run build first)');
    const assetFiles = fs.readdirSync(distAssetsPath);

    const jsChunks = assetFiles.filter(f => f.endsWith('.js'));
    assert.ok(jsChunks.length >= 15, `Expected at least 15 code-split chunks, found ${jsChunks.length}`);

    // Find the main index entry chunk
    const indexChunk = jsChunks.find(f => f.startsWith('index-'));
    assert.ok(indexChunk, 'Main entry chunk must exist');

    const indexChunkSize = fs.statSync(path.join(distAssetsPath, indexChunk)).size;
    const indexChunkSizeKB = indexChunkSize / 1024;

    // Monolithic baseline was 1,000.27 kB. Target is < 70 kB!
    assert.ok(
      indexChunkSizeKB < 70,
      `Entry chunk size must be < 70 kB (was 1,000.27 kB baseline, currently ${indexChunkSizeKB.toFixed(2)} kB)`
    );

    // Verify gzipped size of entry chunk is < 15 kB (was 247 kB baseline)
    const content = fs.readFileSync(path.join(distAssetsPath, indexChunk));
    const gzipped = zlib.gzipSync(content);
    const gzippedKB = gzipped.length / 1024;
    assert.ok(
      gzippedKB < 15,
      `Gzipped entry chunk size must be < 15 kB (was 247 kB baseline, currently ${gzippedKB.toFixed(2)} kB)`
    );
  });

  test('Benchmark 2: Static Asset Caching Headers in vercel.json', () => {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf-8'));
    assert.ok(vercelConfig.headers, 'Vercel headers must be defined');

    // 1-year immutable caching for static hashed assets
    const assetsHeader = vercelConfig.headers.find(h => h.source === '/assets/(.*)');
    assert.ok(assetsHeader, 'Header rule for /assets/(.*) must exist');
    const assetCacheControl = assetsHeader.headers.find(h => h.key === 'Cache-Control');
    assert.ok(assetCacheControl, 'Cache-Control for assets must exist');
    assert.ok(assetCacheControl.value.includes('immutable'), 'Static assets must be cached immutably');
    assert.ok(assetCacheControl.value.includes('31536000'), 'Static assets must have 1-year max-age');

    // Root/HTML revalidation header
    const globalHeader = vercelConfig.headers.find(h => h.source === '/(.*)');
    assert.ok(globalHeader, 'Global header rule must exist');
    const globalCacheControl = globalHeader.headers.find(h => h.key === 'Cache-Control');
    assert.ok(globalCacheControl, 'Cache-Control for HTML must exist');
    assert.ok(globalCacheControl.value.includes('must-revalidate'), 'HTML must require revalidation');
  });

  test('Benchmark 3: Font Optimization & Non-Blocking Font Loading', () => {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

    // Preconnect & DNS prefetch
    assert.ok(indexHtml.includes('rel="dns-prefetch" href="https://fonts.googleapis.com"'), 'dns-prefetch for Google Fonts required');
    assert.ok(indexHtml.includes('rel="dns-prefetch" href="https://fonts.gstatic.com"'), 'dns-prefetch for GStatic required');
    assert.ok(indexHtml.includes('rel="preconnect" href="https://fonts.googleapis.com"'), 'preconnect for Google Fonts required');
    assert.ok(indexHtml.includes('rel="preconnect" href="https://fonts.gstatic.com" crossorigin'), 'preconnect with crossorigin for GStatic required');

    // Non-blocking stylesheet loading with preload and noscript fallback
    assert.ok(indexHtml.includes('rel="preload" as="style"'), 'Font CSS must be preloaded');
    assert.ok(indexHtml.includes('display=swap'), 'font-display: swap must be configured');
    assert.ok(indexHtml.includes('<noscript>'), 'noscript fallback for fonts must exist');
  });

  test('Benchmark 4: CLS Invariant — Explicit Image Dimensions & Media Bounds', () => {
    const avatarSource = fs.readFileSync(path.resolve('src/components/ui/Avatar.tsx'), 'utf-8');
    assert.ok(avatarSource.includes('width='), 'Avatar must declare width attribute');
    assert.ok(avatarSource.includes('height='), 'Avatar must declare height attribute');
    assert.ok(avatarSource.includes('loading="lazy"'), 'Avatar must have lazy loading');
    assert.ok(avatarSource.includes('decoding="async"'), 'Avatar must have async decoding');

    const gallerySource = fs.readFileSync(path.resolve('src/components/ui/EvidenceGallery.tsx'), 'utf-8');
    assert.ok(gallerySource.includes('width={320}'), 'Evidence thumbnail must declare width');
    assert.ok(gallerySource.includes('height={180}'), 'Evidence thumbnail must declare height');
    assert.ok(gallerySource.includes('loading="lazy"'), 'Evidence thumbnail must have lazy loading');

    const modalSource = fs.readFileSync(path.resolve('src/components/StandardReportModal.tsx'), 'utf-8');
    assert.ok(modalSource.includes('width={400}'), 'Report modal image must declare width');
    assert.ok(modalSource.includes('height={176}'), 'Report modal image must declare height');
  });

  test('Benchmark 5: Modern Image Formats & WebP Delivery across Dataset', () => {
    const mockDataSource = fs.readFileSync(path.resolve('src/data/mockData.ts'), 'utf-8');
    assert.ok(mockDataSource.includes('fm=webp'), 'Mock data image URLs must specify modern WebP format');
    assert.ok(mockDataSource.includes('q=75'), 'Image compression quality must be tuned to 75');

    const propertySource = fs.readFileSync(path.resolve('src/services/propertyService.ts'), 'utf-8');
    assert.ok(propertySource.includes('fm=webp'), 'Property images must specify WebP format');
  });

  test('Benchmark 6: Slow Connection Simulation (Slow 3G & Fast 3G Waterfall)', () => {
    // Network profiles according to Lighthouse & WebPageTest standards:
    // Slow 3G: 400 Kbps (50 KB/s), 400ms RTT
    // Fast 3G: 1,600 Kbps (200 KB/s), 150ms RTT
    const assetFiles = fs.readdirSync(distAssetsPath);
    const indexChunk = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
    const _indexSize = fs.statSync(path.join(distAssetsPath, indexChunk)).size;
    const indexGzipSize = zlib.gzipSync(fs.readFileSync(path.join(distAssetsPath, indexChunk))).length;

    const _beforeMonolithBytes = 1000270; // 1,000.27 kB baseline
    const beforeGzipBytes = 247300;     // 247.30 kB baseline

    // Slow 3G transfer times (gzipped wire bytes)
    const slow3GSpeedBytesPerSec = 50 * 1024;
    const slow3GRTTSeconds = 0.4;
    const beforeSlow3GSeconds = (beforeGzipBytes / slow3GSpeedBytesPerSec) + (slow3GRTTSeconds * 4);
    const afterSlow3GSeconds = (indexGzipSize / slow3GSpeedBytesPerSec) + (slow3GRTTSeconds * 4);

    // Fast 3G transfer times
    const fast3GSpeedBytesPerSec = 200 * 1024;
    const fast3GRTTSeconds = 0.15;
    const beforeFast3GSeconds = (beforeGzipBytes / fast3GSpeedBytesPerSec) + (fast3GRTTSeconds * 4);
    const afterFast3GSeconds = (indexGzipSize / fast3GSpeedBytesPerSec) + (fast3GRTTSeconds * 4);

    // Quantifiable improvements
    const byteSavingsPercent = ((beforeGzipBytes - indexGzipSize) / beforeGzipBytes) * 100;
    const slow3GSavingsPercent = ((beforeSlow3GSeconds - afterSlow3GSeconds) / beforeSlow3GSeconds) * 100;
    const fast3GSavingsPercent = ((beforeFast3GSeconds - afterFast3GSeconds) / beforeFast3GSeconds) * 100;

    assert.ok(byteSavingsPercent > 90, `Expected >90% raw wire byte reduction, got ${byteSavingsPercent.toFixed(1)}%`);
    assert.ok(slow3GSavingsPercent > 70, `Expected >70% network time reduction on Slow 3G, got ${slow3GSavingsPercent.toFixed(1)}%`);
    assert.ok(fast3GSavingsPercent > 60, `Expected >60% network time reduction on Fast 3G, got ${fast3GSavingsPercent.toFixed(1)}%`);
  });
});
