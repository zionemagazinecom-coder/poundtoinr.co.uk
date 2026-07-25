# Hostinger DNS

The domain remains registered at Hostinger. DNS should point to Cloudflare when production deployment is ready.

1. Add `poundtoinr.co.uk` to Cloudflare.
2. Copy the Cloudflare nameservers.
3. In Hostinger, replace the current nameservers with the Cloudflare nameservers.
4. Preserve any existing email records before changing DNS.
5. In Cloudflare Pages, connect `poundtoinr.co.uk` and `www.poundtoinr.co.uk`.
6. Set the root domain as primary.
7. Redirect `www` to the root domain.
8. Wait for DNS propagation and verify HTTPS.

Do not modify live DNS automatically from this repository.
