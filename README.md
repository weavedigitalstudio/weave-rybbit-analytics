# Weave Rybbit Analytics

Lightweight [Rybbit Analytics](https://rybbit.com) tracking for WordPress with Nginx proxy support and Gravity Forms event tracking. Built for **Weave Digital Studio** and **HumanKind** client sites.

## Features

- Single `<script>` tag output — no bloat, no jQuery dependency
- Nginx reverse proxy mode to bypass ad blockers
- Gravity Forms event tracking (AJAX and non-AJAX submissions)
- Admin and logged-in user exclusions
- Configurable script loading strategy (async/defer)
- React settings page using `@wordpress/components`
- GitHub-based automatic updates

## Requirements

- WordPress 6.2+
- PHP 8.1+
- Node.js 20+ (for building from source)

## Installation

Download the latest release zip from [GitHub Releases](https://github.com/weavedigitalstudio/weave-rybbit-analytics/releases) and install via Plugins -> Add New -> Upload Plugin.

Updates appear automatically in Dashboard -> Updates via the built-in GitHub updater.

## Configuration

Navigate to **Settings -> Rybbit Analytics** in the WordPress admin.

### Tracking Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Site ID | — | Numeric ID from your Rybbit dashboard (required) |
| Instance URL | `https://app.rybbit.io` | Your Rybbit instance URL |
| Proxy Mode | Off | Serve tracking script from your own domain |
| Proxy Path | `/ry` | Local path for proxy mode (must match Nginx config) |

### Tracking Options

| Setting | Default | Description |
|---------|---------|-------------|
| Disable for Admins | On | Skip tracking for administrators |
| Disable for Logged-in Users | Off | Skip tracking for all logged-in users |
| Script Loading | `async` | Loading strategy: `async`, `defer`, or `async defer` |

### Gravity Forms

| Setting | Default | Description |
|---------|---------|-------------|
| Enable GF Tracking | Off | Fire Rybbit events on form submissions |
| Event Name | `form_submission` | Event name sent to Rybbit |
| Include Form Title | On | Send form title as event property |
| Include Form ID | On | Send form ID as event property |
| Tracked Forms | — | Comma-separated form IDs (blank = all) |

## Proxy Mode

Proxy mode changes the tracking script `src` from `https://app.rybbit.io/api/script.js` to a local path like `/ry/script.js`. Combined with an Nginx reverse proxy, this makes all analytics requests appear to come from your own domain, bypassing ad blockers.

See `nginx-proxy-config.md` in the repository for the companion Nginx configuration.

## Development

```bash
npm install && npm run build    # Production build
npm run start                   # Watch mode
npm run lint                    # Lint JS
```

## Release Process

1. Bump version in `weave-rybbit-analytics.php` header and `package.json`
2. Update `CHANGELOG.md`
3. Commit and push to `main`
4. Tag and push: `git tag -a v1.x.x -m "Version 1.x.x" && git push origin main --tags`
5. GitHub Actions builds and publishes the release automatically

## Licence

GPL-2.0-or-later
