<?php
/**
 * Gravity Forms event tracking integration.
 *
 * Outputs an inline script in wp_footer that fires Rybbit trackEvent
 * calls on Gravity Forms submissions (both AJAX and non-AJAX).
 *
 * Only loaded when GF tracking is enabled AND Gravity Forms is active.
 *
 * @package WeaveRybbitAnalytics
 */

declare( strict_types=1 );

namespace WeaveRybbitAnalytics\GravityForms;

defined( 'ABSPATH' ) || exit;

/**
 * Output the Gravity Forms tracking script in wp_footer.
 */
function output_gf_tracking_script(): void {
	// Only proceed if Gravity Forms is active.
	if ( ! class_exists( 'GFForms' ) ) {
		return;
	}

	// Don't output on admin pages.
	if ( is_admin() ) {
		return;
	}

	$settings = \WeaveRybbitAnalytics\SettingsPage\get_settings();

	// Bail if no Site ID configured (tracking script won't be present).
	if ( '' === trim( $settings['site_id'] ) ) {
		return;
	}

	// Check user exclusions (match the tracking script logic).
	if ( ! empty( $settings['disable_for_logged_in'] ) && is_user_logged_in() ) {
		return;
	}

	if ( ! empty( $settings['disable_for_admins'] ) && current_user_can( 'manage_options' ) ) {
		return;
	}

	$event_name    = esc_js( $settings['gf_event_name'] ?: 'form_submission' );
	$include_title = ! empty( $settings['gf_include_title'] );
	$include_id    = ! empty( $settings['gf_include_id'] );
	$tracked_forms = trim( $settings['gf_tracked_forms'] );

	// Build the list of tracked form IDs (empty = all forms).
	$form_ids_js = '[]';
	if ( '' !== $tracked_forms ) {
		$ids         = array_map( 'absint', explode( ',', $tracked_forms ) );
		$ids         = array_filter( $ids );
		$form_ids_js = wp_json_encode( array_values( $ids ) );
	}

	$include_title_js = $include_title ? 'true' : 'false';
	$include_id_js    = $include_id ? 'true' : 'false';

	// Build a map of form ID → title from GF so we don't rely on DOM scraping.
	$form_titles_map = [];
	if ( $include_title && class_exists( 'GFAPI' ) ) {
		$gf_forms = \GFAPI::get_forms( true, false, 'title' );
		foreach ( $gf_forms as $gf_form ) {
			$form_titles_map[ (int) $gf_form['id'] ] = $gf_form['title'];
		}
	}
	$form_titles_js = wp_json_encode( (object) $form_titles_map );

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped — all values are escaped above.
	?>
<script>
(function(){
	var cfg = {
		event: '<?php echo $event_name; ?>',
		trackedForms: <?php echo $form_ids_js; ?>,
		includeTitle: <?php echo $include_title_js; ?>,
		includeId: <?php echo $include_id_js; ?>,
		formTitles: <?php echo $form_titles_js; ?>
	};

	function shouldTrack(formId) {
		return cfg.trackedForms.length === 0 || cfg.trackedForms.indexOf(parseInt(formId, 10)) !== -1;
	}

	function fireEvent(formId) {
		if (typeof window.rybbit === 'undefined' || typeof window.rybbit.event !== 'function') {
			return;
		}
		var props = {};
		if (cfg.includeId) props.form_id = String(formId);
		if (cfg.includeTitle && cfg.formTitles[formId]) props.form_title = cfg.formTitles[formId];
		window.rybbit.event(cfg.event, props);
	}

	/* AJAX submissions — Gravity Forms fires this jQuery event. */
	if (typeof jQuery !== 'undefined') {
		jQuery(document).on('gform_confirmation_loaded', function(e, formId) {
			if (!shouldTrack(formId)) return;
			fireEvent(formId);
		});
	}

	/* Non-AJAX (redirect) confirmations via URL parameter. */
	var params = new URLSearchParams(window.location.search);
	var gfConfirm = params.get('gf_confirmation');
	if (gfConfirm && shouldTrack(gfConfirm)) {
		fireEvent(gfConfirm);
	}
})();
</script>
	<?php
	// phpcs:enable
}
add_action( 'wp_footer', __NAMESPACE__ . '\output_gf_tracking_script', 20 );

/**
 * Add a gf_confirmation query parameter on non-AJAX form submissions.
 *
 * This allows the inline script to detect a successful submission
 * when the page reloads after a redirect confirmation.
 *
 * @param string|array $confirmation The confirmation message (string) or redirect config (array).
 * @param array        $form         The form data.
 * @param array        $entry        The entry data.
 * @param bool         $ajax         Whether this is an AJAX submission.
 * @return string|array Modified confirmation.
 */
function add_confirmation_parameter( $confirmation, $form, $entry, $ajax ): string|array {
	// Only modify redirect-type confirmations for non-AJAX submissions.
	if ( $ajax ) {
		return $confirmation;
	}

	$settings = \WeaveRybbitAnalytics\SettingsPage\get_settings();

	$tracked_forms = trim( $settings['gf_tracked_forms'] );
	if ( '' !== $tracked_forms ) {
		$ids = array_map( 'absint', explode( ',', $tracked_forms ) );
		if ( ! in_array( (int) $form['id'], $ids, true ) ) {
			return $confirmation;
		}
	}

	// For message-type confirmations, GF stays on the same page — the
	// gform_confirmation_loaded jQuery event handles these natively. We
	// only need to handle redirect confirmations.
	if ( isset( $confirmation['redirect'] ) ) {
		$url = $confirmation['redirect'];
		$confirmation['redirect'] = add_query_arg( 'gf_confirmation', (string) $form['id'], $url );
	}

	return $confirmation;
}
add_filter( 'gform_confirmation', __NAMESPACE__ . '\add_confirmation_parameter', 10, 4 );
