/**
 * Main settings app with tabbed navigation.
 *
 * Uses @wordpress/components TabPanel for four tabs:
 * Tracking / Options / Gravity Forms / About.
 */
import { TabPanel, Notice, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSettings } from '../hooks/useSettings';
import TrackingTab from './TrackingTab';
import OptionsTab from './OptionsTab';
import GravityFormsTab from './GravityFormsTab';
import AboutTab from './AboutTab';

export default function SettingsApp() {
	const {
		settings,
		setSettings,
		saveSettings,
		isSaving,
		notice,
		setNotice,
	} = useSettings();

	if ( settings === null ) {
		return <Spinner />;
	}

	const tabs = [
		{
			name: 'tracking',
			title: __( 'Tracking', 'weave-rybbit-analytics' ),
		},
		{
			name: 'options',
			title: __( 'Options', 'weave-rybbit-analytics' ),
		},
		{
			name: 'gravity-forms',
			title: __( 'Gravity Forms', 'weave-rybbit-analytics' ),
		},
		{
			name: 'about',
			title: __( 'About', 'weave-rybbit-analytics' ),
		},
	];

	return (
		<div style={ { maxWidth: '800px' } }>
			<h1>{ __( 'Rybbit Analytics', 'weave-rybbit-analytics' ) }</h1>

			{ notice && (
				<Notice
					status={ notice.status }
					isDismissible
					onDismiss={ () => setNotice( null ) }
				>
					{ notice.message }
				</Notice>
			) }

			<TabPanel tabs={ tabs }>
				{ ( tab ) => {
					switch ( tab.name ) {
						case 'tracking':
							return (
								<TrackingTab
									settings={ settings }
									setSettings={ setSettings }
									saveSettings={ saveSettings }
									isSaving={ isSaving }
								/>
							);
						case 'options':
							return (
								<OptionsTab
									settings={ settings }
									setSettings={ setSettings }
									saveSettings={ saveSettings }
									isSaving={ isSaving }
								/>
							);
						case 'gravity-forms':
							return (
								<GravityFormsTab
									settings={ settings }
									setSettings={ setSettings }
									saveSettings={ saveSettings }
									isSaving={ isSaving }
								/>
							);
						case 'about':
							return <AboutTab />;
						default:
							return null;
					}
				} }
			</TabPanel>
		</div>
	);
}
