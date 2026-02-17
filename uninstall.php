<?php
/**
 * Plugin uninstall handler.
 *
 * Removes all plugin data from the database when the plugin is deleted
 * from the WordPress admin (not just deactivated).
 *
 * @package WeaveRybbitAnalytics
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Remove plugin settings.
delete_option( 'weave_rybbit_settings' );

// Remove GitHub updater transient.
delete_transient( 'weave_rybbit_analytics_github_response' );
