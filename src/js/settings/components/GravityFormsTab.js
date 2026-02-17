/**
 * Gravity Forms integration tab.
 *
 * Enable/disable GF tracking, event name, form title/ID inclusion,
 * and specific form ID filtering.
 */
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function GravityFormsTab( {
	settings,
	setSettings,
	saveSettings,
	isSaving,
} ) {
	const updateSetting = ( key, value ) => {
		setSettings( { ...settings, [ key ]: value } );
	};

	return (
		<div style={ { marginTop: '16px' } }>
			<PanelBody
				title={ __( 'Gravity Forms Tracking', 'weave-rybbit-analytics' ) }
				initialOpen
			>
				<PanelRow>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Enable GF Tracking', 'weave-rybbit-analytics' ) }
						help={ __(
							'Fire Rybbit events on Gravity Forms submissions. Requires Gravity Forms to be active.',
							'weave-rybbit-analytics'
						) }
						checked={ !! settings.gf_enable }
						onChange={ ( value ) =>
							updateSetting( 'gf_enable', value )
						}
					/>
				</PanelRow>

				{ settings.gf_enable && (
					<>
						<PanelRow>
							<TextControl
								__nextHasNoMarginBottom
								label={ __( 'Event Name', 'weave-rybbit-analytics' ) }
								help={ __(
									'The event name sent to Rybbit when a form is submitted.',
									'weave-rybbit-analytics'
								) }
								value={ settings.gf_event_name || '' }
								onChange={ ( value ) =>
									updateSetting( 'gf_event_name', value )
								}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Include Form Title', 'weave-rybbit-analytics' ) }
								help={ __(
									'Send the form title as an event property.',
									'weave-rybbit-analytics'
								) }
								checked={ !! settings.gf_include_title }
								onChange={ ( value ) =>
									updateSetting( 'gf_include_title', value )
								}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Include Form ID', 'weave-rybbit-analytics' ) }
								help={ __(
									'Send the form ID as an event property.',
									'weave-rybbit-analytics'
								) }
								checked={ !! settings.gf_include_id }
								onChange={ ( value ) =>
									updateSetting( 'gf_include_id', value )
								}
							/>
						</PanelRow>
						<PanelRow>
							<TextControl
								__nextHasNoMarginBottom
								label={ __( 'Tracked Forms', 'weave-rybbit-analytics' ) }
								help={ __(
									'Comma-separated form IDs to track. Leave blank to track all forms.',
									'weave-rybbit-analytics'
								) }
								value={ settings.gf_tracked_forms || '' }
								onChange={ ( value ) =>
									updateSetting( 'gf_tracked_forms', value )
								}
							/>
						</PanelRow>
					</>
				) }
			</PanelBody>

			<div style={ { marginTop: '16px' } }>
				<Button
					variant="primary"
					isBusy={ isSaving }
					disabled={ isSaving }
					onClick={ () => saveSettings( settings ) }
				>
					{ isSaving
						? __( 'Saving…', 'weave-rybbit-analytics' )
						: __( 'Save Settings', 'weave-rybbit-analytics' ) }
				</Button>
			</div>
		</div>
	);
}
