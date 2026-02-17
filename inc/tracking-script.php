<?php
/**
 * Frontend tracking script output.
 *
 * Outputs the Rybbit Analytics <script> tag in wp_head. Uses direct output
 * rather than wp_enqueue_script because Rybbit's auto-discovery parses its
 * own src attribute to determine the tracking endpoint.
 *
 * @package WeaveRybbitAnalytics
 */

declare( strict_types=1 );

namespace WeaveRybbitAnalytics\TrackingScript;

defined( 'ABSPATH' ) || exit;

/**
 * Output the Rybbit tracking script tag in wp_head.
 */
function output_tracking_script(): void {
	// Don't output on admin pages.
	if ( is_admin() ) {
		return;
	}

	$settings = \WeaveRybbitAnalytics\SettingsPage\get_settings();

	// Bail if no Site ID configured.
	$site_id = trim( $settings['site_id'] );
	if ( '' === $site_id ) {
		return;
	}

	// Check user exclusions.
	if ( ! empty( $settings['disable_for_logged_in'] ) && is_user_logged_in() ) {
		return;
	}

	if ( ! empty( $settings['disable_for_admins'] ) && current_user_can( 'manage_options' ) ) {
		return;
	}

	// Build the script src.
	if ( ! empty( $settings['proxy_enabled'] ) ) {
		$proxy_path = '/' . ltrim( $settings['proxy_path'], '/' );
		$src        = $proxy_path . '/script.js';
	} else {
		$instance_url = rtrim( $settings['instance_url'], '/' );
		$src          = $instance_url . '/api/script.js';
	}

	// Build the loading attribute(s).
	$loading = $settings['script_loading'] ?? 'async';

	printf(
		'<script src="%s" %s data-site-id="%s"></script>' . "\n",
		esc_url( $src ),
		esc_attr( $loading ),
		esc_attr( $site_id )
	);
}
add_action( 'wp_head', __NAMESPACE__ . '\output_tracking_script', 1 );
