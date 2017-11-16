<?php
/**
 * Replaces default theme updater with GitHub-based updater. Necessary to allow
 * for theme updates while not yet in the theme repository.
 *
 * @package dones
 */

/**
 * Prevent Dones from being considered in theme update checks.
 *
 * @param array  $r   An array of HTTP request arguments.
 * @param string $url The request URL.
 * @return array      An array of HTTP request arguments.
 */
function dones_exclude_from_update( $r, $url ) {
	$normalized_url = set_url_scheme( $url, 'http' );
	if ( 0 === strpos( $normalized_url, 'http://api.wordpress.org/themes/update-check' ) ) {
		$themes = json_decode( $r['body']['themes'], true );
		unset( $themes['themes']['dones'] );
		$r['body']['themes'] = json_encode( $themes );
	}

	return $r;
}
add_filter( 'http_request_args', 'dones_exclude_from_update', 10, 2 );

/**
 * Performs an update check for the latest version of the theme, returning a
 * modified theme updates transient with result.
 *
 * @param object $value Value of theme updates transient.
 * @return object       Modified value of theme updates transient.
 */
function dones_check_for_update( $value ) {
	// Bypass update check while installing.
	if ( defined( 'WP_INSTALLING' ) ) {
		return $value;
	}

	// Fetch latest version.
	$response = wp_remote_get( 'https://api.github.com/repos/aduth/dones/releases/latest' );
	if ( is_wp_error( $response ) || ! is_array( $response ) ) {
		return $value;
	}

	// Skip if same version.
	$release = json_decode( $response['body'], true );
	$version = $release['tag_name'];
	$theme   = wp_get_theme();
	if ( $theme->get( 'Version' ) === $version ) {
		return $value;
	}

	// Find pre-built release zip URL, or bail.
	foreach ( $release['assets'] as $asset ) {
		if ( 'dones.zip' === $asset['name'] ) {
			$url = $asset['browser_download_url'];
			break;
		}
	}

	if ( ! isset( $url ) ) {
		return $value;
	}

	// Initialize pending updates.
	if ( ! isset( $value->response ) ) {
		$value->response = array();
	}

	// Assign update.
	$value->response['dones'] = array(
		'theme'       => 'dones',
		'new_version' => $version,
		'url'         => $theme->get( 'ThemeURI' ),
		'package'     => $url,
	);

	return $value;
}
add_action( 'pre_set_site_transient_update_themes', 'dones_check_for_update' );
