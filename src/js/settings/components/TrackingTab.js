/**
 * Tracking Configuration tab.
 *
 * Site ID, instance URL, proxy mode and proxy path settings.
 */
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function TrackingTab( {
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
				title={ __( 'Tracking Configuration', 'weave-rybbit-analytics' ) }
				initialOpen
			>
				<PanelRow>
					<TextControl
						__nextHasNoMarginBottom
						label={ __( 'Site ID', 'weave-rybbit-analytics' ) }
						help={ __(
							'The numeric site ID from your Rybbit dashboard. Required for tracking to work.',
							'weave-rybbit-analytics'
						) }
						value={ settings.site_id || '' }
						onChange={ ( value ) =>
							updateSetting( 'site_id', value )
						}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						__nextHasNoMarginBottom
						label={ __( 'Rybbit Instance URL', 'weave-rybbit-analytics' ) }
						help={ __(
							'The URL of your Rybbit instance. Change this for self-hosted installations.',
							'weave-rybbit-analytics'
						) }
						value={ settings.instance_url || '' }
						onChange={ ( value ) =>
							updateSetting( 'instance_url', value )
						}
					/>
				</PanelRow>
				<PanelRow>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Enable Proxy Mode', 'weave-rybbit-analytics' ) }
						help={ __(
							'Serve the tracking script from your own domain via an Nginx reverse proxy. Helps bypass ad blockers.',
							'weave-rybbit-analytics'
						) }
						checked={ !! settings.proxy_enabled }
						onChange={ ( value ) =>
							updateSetting( 'proxy_enabled', value )
						}
					/>
				</PanelRow>
				{ settings.proxy_enabled && (
					<PanelRow>
						<TextControl
							__nextHasNoMarginBottom
							label={ __( 'Proxy Path', 'weave-rybbit-analytics' ) }
							help={ __(
								'The local URL path that proxies to Rybbit. Must match your Nginx configuration.',
								'weave-rybbit-analytics'
							) }
							value={ settings.proxy_path || '' }
							onChange={ ( value ) =>
								updateSetting( 'proxy_path', value )
							}
						/>
					</PanelRow>
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
