# Cloudflare Pages Yayın Notu

Bu repo build gerektirmeyen statik demo olarak hazırlanmıştır.

Cloudflare Pages ayarları:

- Framework preset: `None`
- Build command: boş bırakılabilir
- Build output directory: `public_html`
- Root directory: repo kökü

Alternatif CLI deploy:

```bash
npx wrangler pages deploy public_html --project-name turksat-akademi-demo
```

Demo tek gösterimlik olduğu için `robots.txt`, HTML meta etiketleri ve `_headers` üzerinden indeksleme kapalıdır.

