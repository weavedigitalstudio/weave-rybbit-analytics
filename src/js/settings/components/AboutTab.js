/**
 * About tab.
 *
 * Displays plugin information, version, proxy mode explanation, and links.
 */
import { useState } from '@wordpress/element';
import {
	Card,
	CardBody,
	CardHeader,
	ExternalLink,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function AboutTab() {
	/* global weaveRybbitAnalytics */
	const version = window.weaveRybbitAnalytics?.version || '1.0.0';
	const iconUrl = window.weaveRybbitAnalytics?.iconUrl || '';
	const [ iconError, setIconError ] = useState( false );

	return (
		<div style={ { marginTop: '16px' } }>
			<Card>
				<CardHeader>
					<div style={ { display: 'flex', alignItems: 'center', gap: '12px' } }>
						{ iconUrl && ! iconError ? (
							<img
								src={ iconUrl }
								alt={ __( 'Plugin icon', 'weave-rybbit-analytics' ) }
								width={ 48 }
								height={ 48 }
								style={ { borderRadius: '4px' } }
								onError={ () => setIconError( true ) }
							/>
						) : (
							<span
								className="dashicons dashicons-chart-line"
								style={ { fontSize: '48px', width: '48px', height: '48px' } }
							/>
						) }
						<h2 style={ { margin: 0 } }>
							{ __( 'Weave Rybbit Analytics', 'weave-rybbit-analytics' ) }
						</h2>
					</div>
				</CardHeader>
				<CardBody>
					<p>
						{ __(
							'Lightweight Rybbit Analytics tracking for WordPress with proxy support and Gravity Forms event tracking.',
							'weave-rybbit-analytics'
						) }
					</p>
					<p>
						<strong>
							{ __( 'Version:', 'weave-rybbit-analytics' ) }
						</strong>{ ' ' }
						{ version }
					</p>
					<p>
						<strong>
							{ __( 'Author:', 'weave-rybbit-analytics' ) }
						</strong>{ ' ' }
						<ExternalLink href="https://weave.co.nz">
							Weave Digital Studio
						</ExternalLink>
					</p>
					<p>
						<strong>
							{ __( 'Repository:', 'weave-rybbit-analytics' ) }
						</strong>{ ' ' }
						<ExternalLink href="https://github.com/weavedigitalstudio/weave-rybbit-analytics">
							GitHub
						</ExternalLink>
					</p>
				</CardBody>
			</Card>

			<Card style={ { marginTop: '16px' } }>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Proxy Mode', 'weave-rybbit-analytics' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<p>
						{ __(
							'Proxy mode serves the Rybbit tracking script from your own domain via an Nginx reverse proxy. This prevents ad blockers from blocking analytics requests, as the browser only communicates with your domain.',
							'weave-rybbit-analytics'
						) }
					</p>
					<p>
						{ __(
							'To use proxy mode, you need to configure Nginx on your server to forward requests from the proxy path (e.g. /ry/) to app.rybbit.io/api/. See the companion Nginx configuration documentation in the plugin repository.',
							'weave-rybbit-analytics'
						) }
					</p>
				</CardBody>
			</Card>

			<Card style={ { marginTop: '16px' } }>
				<CardHeader>
					<h2 style={ { margin: 0 } }>
						{ __( 'Resources', 'weave-rybbit-analytics' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<ul>
						<li>
							<ExternalLink href="https://rybbit.com/docs/script">
								{ __(
									'Rybbit Tracking Script Docs',
									'weave-rybbit-analytics'
								) }
							</ExternalLink>
						</li>
						<li>
							<ExternalLink href="https://rybbit.com/docs/proxy-guide/nginx">
								{ __(
									'Rybbit Nginx Proxy Guide',
									'weave-rybbit-analytics'
								) }
							</ExternalLink>
						</li>
						<li>
							<ExternalLink href="https://rybbit.com/docs/guides/wordpress">
								{ __(
									'Rybbit WordPress Guide',
									'weave-rybbit-analytics'
								) }
							</ExternalLink>
						</li>
					</ul>
				</CardBody>
			</Card>
		</div>
	);
}
