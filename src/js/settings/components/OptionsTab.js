/**
 * Tracking Options tab.
 *
 * User exclusion rules and script loading strategy.
 */
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	RadioControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function OptionsTab( {
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
				title={ __( 'User Exclusions', 'weave-rybbit-analytics' ) }
				initialOpen
			>
				<PanelRow>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Disable for Administrators', 'weave-rybbit-analytics' ) }
						help={ __(
							'Skip tracking for logged-in administrators.',
							'weave-rybbit-analytics'
						) }
						checked={ !! settings.disable_for_admins }
						onChange={ ( value ) =>
							updateSetting( 'disable_for_admins', value )
						}
					/>
				</PanelRow>
				<PanelRow>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Disable for Logged-in Users', 'weave-rybbit-analytics' ) }
						help={ __(
							'Skip tracking for all logged-in users.',
							'weave-rybbit-analytics'
						) }
						checked={ !! settings.disable_for_logged_in }
						onChange={ ( value ) =>
							updateSetting( 'disable_for_logged_in', value )
						}
					/>
				</PanelRow>
			</PanelBody>

			<PanelBody
				title={ __( 'Script Loading', 'weave-rybbit-analytics' ) }
				initialOpen
			>
				<PanelRow>
					<RadioControl
						label={ __( 'Loading Strategy', 'weave-rybbit-analytics' ) }
						help={ __(
							'How the tracking script should be loaded. Defer is recommended for least impact on performance.',
							'weave-rybbit-analytics'
						) }
						selected={ settings.script_loading || 'async' }
						options={ [
							{ label: 'async', value: 'async' },
							{ label: 'defer', value: 'defer' },
							{ label: 'async defer', value: 'async defer' },
						] }
						onChange={ ( value ) =>
							updateSetting( 'script_loading', value )
						}
					/>
				</PanelRow>
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
