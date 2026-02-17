# Nginx Proxy Configuration for Rybbit Analytics

Companion server-side configuration for the Weave Rybbit Analytics WordPress plugin. This Nginx config creates a reverse proxy that forwards requests from your domain to `app.rybbit.io`, allowing the tracking script and all API calls to appear as first-party requests.

## How It Works

When proxy mode is enabled in the plugin, the tracking script `src` changes from `https://app.rybbit.io/api/script.js` to `/ry/script.js` (a relative path on your domain). Rybbit's script auto-discovers its tracking endpoint by parsing its own `src` attribute, so it automatically sends all data to `/ry/track`, `/ry/identify`, etc. on your domain.

Nginx intercepts these `/ry/*` requests and proxies them to `app.rybbit.io/api/*`. The browser never sees the Rybbit domain, so ad blockers that block known analytics domains cannot interfere. The short, generic path also avoids pattern-matching by aggressive filter lists that target common analytics path names.

## Nginx Configuration

```nginx
# Rybbit Analytics Proxy
# Reverse proxy /ry/* to app.rybbit.io/api/*
# Bypasses ad blockers by serving analytics from the same domain

# Main tracking script
location = /ry/script.js {
    proxy_pass https://app.rybbit.io/api/script.js;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_ssl_server_name on;
    add_header Cache-Control "public, max-age=3600";
}

# Session replay script
location = /ry/replay.js {
    proxy_pass https://app.rybbit.io/api/replay.js;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_ssl_server_name on;
    add_header Cache-Control "public, max-age=3600";
}

# Web Vitals metrics script
location = /ry/metrics.js {
    proxy_pass https://app.rybbit.io/api/metrics.js;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_ssl_server_name on;
    add_header Cache-Control "public, max-age=3600";
}

# Event tracking endpoint (never cache)
location = /ry/track {
    proxy_pass https://app.rybbit.io/api/track;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Content-Type application/json;
    proxy_ssl_server_name on;
}

# User identification endpoint (never cache)
location = /ry/identify {
    proxy_pass https://app.rybbit.io/api/identify;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Content-Type application/json;
    proxy_ssl_server_name on;
}

# Session replay recording (never cache, allow larger uploads)
location ~ ^/ry/session-replay/record/(.*)$ {
    proxy_pass https://app.rybbit.io/api/session-replay/record/$1;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Content-Type application/json;
    proxy_ssl_server_name on;
    client_max_body_size 10M;
}

# Site tracking config (cache briefly)
location ~ ^/ry/site/tracking-config/(.*)$ {
    proxy_pass https://app.rybbit.io/api/site/tracking-config/$1;
    proxy_set_header Host app.rybbit.io;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_ssl_server_name on;
    add_header Cache-Control "public, max-age=300";
}
```

## Deployment on GridPane

### Server-wide (all sites on a server)

Place the config at:

```
/etc/nginx/extra.d/rybbit-main-context.conf
```

Then copy to the `_custom` directory for persistence across GridPane updates:

```bash
cp /etc/nginx/extra.d/rybbit-main-context.conf /etc/nginx/extra.d/_custom/rybbit-main-context.conf
```

### Site-specific (single site)

Place the config at:

```
/var/www/site.url/nginx/rybbit-main-context.conf
```

## Post-Deploy

Test and reload Nginx:

```bash
nginx -t
gp ngx reload
```

## Verification

```bash
curl -I https://yourdomain.com/ry/script.js
# Should return HTTP/2 200 with content-type: application/javascript
```

You can also check the browser Network tab — the tracking script and all subsequent requests should show your domain as the host, with no requests to `app.rybbit.io`.

## Custom Proxy Path

If you change the proxy path in the WordPress plugin settings (e.g. from `/ry` to `/stats`), you must update all `location` blocks in this Nginx config to match. Replace `/ry/` with your chosen path throughout.

## Self-Hosted Rybbit Instances

If you're running a self-hosted Rybbit instance, replace `app.rybbit.io` in all `proxy_pass` and `proxy_set_header Host` directives with your instance hostname.
