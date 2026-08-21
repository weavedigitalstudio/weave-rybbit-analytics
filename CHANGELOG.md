# Changelog

All notable changes to this project will be documented in this file.

## [1.0.2] - 2026-08-21

### Fixed
- The GitHub updater wrote its `no_update` entry only when one did not already
  exist. WordPress core populates `no_update` for every plugin it checked,
  including plugins it does not host, and a core entry carries none of our
  metadata, so core's entry always won. The plugin icon and version metadata
  therefore vanished from the Plugins screen whenever the plugin was already up
  to date, and only appeared while an update was pending. The entry is now
  always written. Same fix applied across the Weave and HumanKind plugins.

## [1.0.1] - 2026-02-19

### Added
- Settings link on the Plugins page for quick access to plugin settings.

## [1.0.0] - 2026-02-17

### Added
- Rybbit Analytics tracking script output with configurable Site ID and instance URL.
- Nginx reverse proxy mode for ad blocker bypass.
- Administrator and logged-in user exclusions.
- Configurable script loading strategy (async/defer).
- Gravity Forms event tracking (AJAX and non-AJAX submissions).
- React settings page with @wordpress/components (four tabs).
- GitHub updater for self-hosted automatic updates.
- GitHub Actions release workflow.
- WordPress Playground blueprint for testing.
- Companion Nginx proxy configuration documentation.
