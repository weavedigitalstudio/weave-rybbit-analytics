<?php
/**
 * Plugin Name:       Weave Rybbit Analytics
 * Plugin URI:        https://github.com/weavedigitalstudio/weave-rybbit-analytics
 * Description:       Lightweight Rybbit Analytics tracking for WordPress with proxy support and Gravity Forms event tracking.
 * Version:           1.0.1
 * Requires at least: 6.2
 * Requires PHP:      8.1
 * Author:            Weave Digital Studio
 * Author URI:        https://weave.co.nz
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       weave-rybbit-analytics
 * Domain Path:       /languages
 * GitHub Plugin URI: weavedigitalstudio/weave-rybbit-analytics
 *
 * @package WeaveRybbitAnalytics
 */

declare( strict_types=1 );

namespace WeaveRybbitAnalytics;

defined( 'ABSPATH' ) || exit;

// Plugin constants.
define( 'WEAVE_RYBBIT_ANALYTICS_VERSION', '1.0.1' );
define( 'WEAVE_RYBBIT_ANALYTICS_FILE', __FILE__ );
define( 'WEAVE_RYBBIT_ANALYTICS_DIR', plugin_dir_path( __FILE__ ) );
define( 'WEAVE_RYBBIT_ANALYTICS_URL', plugin_dir_url( __FILE__ ) );

// Core modules — always loaded.
require_once WEAVE_RYBBIT_ANALYTICS_DIR . 'inc/settings-page.php';
require_once WEAVE_RYBBIT_ANALYTICS_DIR . 'inc/tracking-script.php';
require_once WEAVE_RYBBIT_ANALYTICS_DIR . 'inc/github-updater.php';

// Gravity Forms integration — loaded only when enabled.
$weave_rybbit_settings = SettingsPage\get_settings();

if ( ! empty( $weave_rybbit_settings['gf_enable'] ) ) {
	require_once WEAVE_RYBBIT_ANALYTICS_DIR . 'inc/gravity-forms.php';
}

// Add Settings link on the Plugins page.
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), function ( array $links ): array {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=weave-rybbit-analytics' ) ),
		esc_html__( 'Settings', 'weave-rybbit-analytics' )
	);
	array_unshift( $links, $settings_link );
	return $links;
} );
