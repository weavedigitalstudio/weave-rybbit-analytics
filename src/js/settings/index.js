/**
 * Settings page entry point.
 *
 * Mounts the React settings app into the #weave-rybbit-settings div
 * rendered by inc/settings-page.php.
 */
import { createRoot } from '@wordpress/element';
import SettingsApp from './components/SettingsApp';

const container = document.getElementById( 'weave-rybbit-settings' );

if ( container ) {
	const root = createRoot( container );
	root.render( <SettingsApp /> );
}
