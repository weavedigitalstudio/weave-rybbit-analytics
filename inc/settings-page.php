<?php
/**
 * Settings page registration and REST API exposure.
 *
 * Renders a minimal wrapper div; the React app (built from src/js/settings/)
 * mounts into it. All UI uses @wordpress/components — no custom CSS needed.
 *
 * @package WeaveRybbitAnalytics
 */

declare( strict_types=1 );

namespace WeaveRybbitAnalytics\SettingsPage;

defined( 'ABSPATH' ) || exit;

const OPTION_NAME = 'weave_rybbit_settings';

/**
 * Default settings values.
 *
 * @return array<string, mixed> Settings with default values.
 */
function get_defaults(): array {
	return [
		// Tracking Configuration.
		'site_id'              => '',
		'instance_url'         => 'https://app.rybbit.io',
		'proxy_enabled'        => false,
		'proxy_path'           => '/ry',

		// Tracking Options.
		'disable_for_admins'   => true,
		'disable_for_logged_in' => false,
		'script_loading'       => 'defer',

		// Gravity Forms.
		'gf_enable'            => false,
		'gf_event_name'        => 'form_submission',
		'gf_include_title'     => true,
		'gf_include_id'        => true,
		'gf_tracked_forms'     => '',
	];
}

/**
 * Retrieve plugin settings merged with defaults.
 *
 * @return array<string, mixed> Current settings.
 */
function get_settings(): array {
	$saved = get_option( OPTION_NAME, [] );
	return wp_parse_args( $saved, get_defaults() );
}

/**
 * Register the settings page under the Settings menu.
 */
function add_settings_page(): void {
	add_options_page(
		__( 'Rybbit Analytics', 'weave-rybbit-analytics' ),
		__( 'Rybbit Analytics', 'weave-rybbit-analytics' ),
		'manage_options',
		'weave-rybbit-analytics',
		__NAMESPACE__ . '\render_settings_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\add_settings_page' );

/**
 * Render the settings page wrapper. React mounts into the inner div.
 */
function render_settings_page(): void {
	echo '<div class="wrap"><div id="weave-rybbit-settings"></div></div>';
}

/**
 * Enqueue the React settings app on the settings page only.
 *
 * @param string $hook The current admin page hook suffix.
 */
function enqueue_settings_assets( string $hook ): void {
	if ( 'settings_page_weave-rybbit-analytics' !== $hook ) {
		return;
	}

	$asset_file = WEAVE_RYBBIT_ANALYTICS_DIR . 'build/settings/index.asset.php';
	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'weave-rybbit-settings',
		WEAVE_RYBBIT_ANALYTICS_URL . 'build/settings/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	// Ensure wp-components styles are loaded.
	wp_enqueue_style( 'wp-components' );

	wp_localize_script(
		'weave-rybbit-settings',
		'weaveRybbitAnalytics',
		[
			'version' => WEAVE_RYBBIT_ANALYTICS_VERSION,
			'iconUrl' => \WeaveRybbitAnalytics\GitHubUpdater\Weave_Rybbit_Analytics_Updater::ICON_SMALL,
		]
	);
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_settings_assets' );

/**
 * Register the plugin setting for both admin and REST API contexts.
 *
 * Using register_setting with show_in_rest makes the option available
 * at GET/POST /wp/v2/settings. The React app reads and writes via this
 * endpoint using @wordpress/api-fetch.
 */
function register_plugin_settings(): void {
	register_setting(
		'weave_rybbit_analytics',
		OPTION_NAME,
		[
			'type'              => 'object',
			'sanitize_callback' => __NAMESPACE__ . '\sanitize_settings',
			'default'           => get_defaults(),
			'show_in_rest'      => [
				'schema' => [
					'type'       => 'object',
					'properties' => [
						'site_id'               => [ 'type' => 'string' ],
						'instance_url'          => [ 'type' => 'string' ],
						'proxy_enabled'         => [ 'type' => 'boolean' ],
						'proxy_path'            => [ 'type' => 'string' ],
						'disable_for_admins'    => [ 'type' => 'boolean' ],
						'disable_for_logged_in' => [ 'type' => 'boolean' ],
						'script_loading'        => [ 'type' => 'string' ],
						'gf_enable'             => [ 'type' => 'boolean' ],
						'gf_event_name'         => [ 'type' => 'string' ],
						'gf_include_title'      => [ 'type' => 'boolean' ],
						'gf_include_id'         => [ 'type' => 'boolean' ],
						'gf_tracked_forms'      => [ 'type' => 'string' ],
					],
				],
			],
		]
	);
}
add_action( 'admin_init', __NAMESPACE__ . '\register_plugin_settings' );
add_action( 'rest_api_init', __NAMESPACE__ . '\register_plugin_settings' );

/**
 * Sanitise settings input.
 *
 * @param mixed $input Raw input from the REST API or form submission.
 * @return array<string, mixed> Sanitised settings.
 */
function sanitize_settings( $input ): array {
	$defaults  = get_defaults();
	$sanitised = [];

	// String fields.
	$sanitised['site_id']        = isset( $input['site_id'] ) ? sanitize_text_field( $input['site_id'] ) : $defaults['site_id'];
	$sanitised['instance_url']   = isset( $input['instance_url'] ) ? esc_url_raw( $input['instance_url'] ) : $defaults['instance_url'];
	$sanitised['proxy_path']     = isset( $input['proxy_path'] ) ? '/' . ltrim( sanitize_text_field( $input['proxy_path'] ), '/' ) : $defaults['proxy_path'];
	$sanitised['script_loading'] = isset( $input['script_loading'] ) && in_array( $input['script_loading'], [ 'async', 'defer', 'async defer' ], true )
		? $input['script_loading']
		: $defaults['script_loading'];
	$sanitised['gf_event_name']  = isset( $input['gf_event_name'] ) ? sanitize_text_field( $input['gf_event_name'] ) : $defaults['gf_event_name'];
	$sanitised['gf_tracked_forms'] = isset( $input['gf_tracked_forms'] ) ? sanitize_text_field( $input['gf_tracked_forms'] ) : $defaults['gf_tracked_forms'];

	// Boolean fields.
	$sanitised['proxy_enabled']         = ! empty( $input['proxy_enabled'] );
	$sanitised['disable_for_admins']    = isset( $input['disable_for_admins'] ) ? (bool) $input['disable_for_admins'] : $defaults['disable_for_admins'];
	$sanitised['disable_for_logged_in'] = ! empty( $input['disable_for_logged_in'] );
	$sanitised['gf_enable']             = ! empty( $input['gf_enable'] );
	$sanitised['gf_include_title']      = isset( $input['gf_include_title'] ) ? (bool) $input['gf_include_title'] : $defaults['gf_include_title'];
	$sanitised['gf_include_id']         = isset( $input['gf_include_id'] ) ? (bool) $input['gf_include_id'] : $defaults['gf_include_id'];

	return $sanitised;
}
