/**
 * Custom hook for reading and saving plugin settings.
 *
 * Uses the WordPress REST API settings endpoint (/wp/v2/settings)
 * which is exposed by register_setting() with show_in_rest in
 * inc/settings-page.php.
 */
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const OPTION_KEY = 'weave_rybbit_settings';

export function useSettings() {
	const [ settings, setSettings ] = useState( null );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ notice, setNotice ] = useState( null );

	// Load settings on mount.
	useEffect( () => {
		apiFetch( { path: '/wp/v2/settings' } ).then( ( response ) => {
			setSettings( response[ OPTION_KEY ] || {} );
		} );
	}, [] );

	/**
	 * Save settings to the database via the REST API.
	 *
	 * @param {Object} newSettings The settings object to save.
	 */
	const saveSettings = async ( newSettings ) => {
		setIsSaving( true );
		setNotice( null );

		try {
			const response = await apiFetch( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { [ OPTION_KEY ]: newSettings },
			} );

			setSettings( response[ OPTION_KEY ] );
			setNotice( {
				status: 'success',
				message: 'Settings saved successfully.',
			} );
		} catch ( error ) {
			setNotice( {
				status: 'error',
				message: error.message || 'Failed to save settings.',
			} );
		}

		setIsSaving( false );
	};

	return { settings, setSettings, saveSettings, isSaving, notice, setNotice };
}
