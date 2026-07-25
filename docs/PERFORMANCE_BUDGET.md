# Performance Budget

- Initial JavaScript target: under 170 KB gzip before charts and admin code.
- Initial CSS target: under 45 KB gzip.
- Charting library: loaded only on historical chart pages.
- Images: responsive, dimensioned and preferably WebP.
- Third-party scripts: disabled by default; ads are reserved with fixed dimensions when enabled.
- Core Web Vitals targets: LCP under 2.5s, CLS under 0.1, INP under 200ms where practical.
- API requests: cache current rates at the Cloudflare edge and avoid calling paid APIs from visitor browsers.
