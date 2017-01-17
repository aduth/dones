<?php

if ( ! defined( 'DONES_VERSION' ) ) {
	define( 'DONES_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function dones_setup() {
	// Add theme support for Custom Logo.
	add_theme_support( 'custom-logo', array(
		'height'     => 66,
		'flex-width' => true
	) );
}
add_action( 'after_setup_theme', 'dones_setup' );

/**
 * Enqueue scripts and styles.
 */
function dones_scripts() {
	// Add custom fonts.
	wp_enqueue_style( 'dones-fonts', 'http://fonts.googleapis.com/css?family=Roboto:400,700,300', array(), null );

	// Theme stylesheet.
	wp_enqueue_style( 'dones-style', get_theme_file_uri( '/dist/style.css' ), array(), DONES_VERSION );
	wp_add_inline_style( 'dones-style', sprintf( 'a { color: %s; }', get_theme_mod( 'brand_color', '#986dda' ) ) );

	// Application script.
	wp_register_script( 'dones-polyfill', add_query_arg( array(
		'features' => 'fetch'
	), 'https://cdn.polyfill.io/v2/polyfill.min.js' ) );
	wp_register_script( 'dones-vendor', get_theme_file_uri( '/dist/vendor.js' ), array(), DONES_VERSION );
	wp_enqueue_script( 'dones-app', get_theme_file_uri( '/dist/app.js' ), array( 'dones-polyfill', 'dones-vendor' ), DONES_VERSION, true );
	wp_localize_script( 'dones-app', 'dones', array(
		'siteName'   => get_bloginfo( 'name' ),
		'apiRoot'    => esc_url_raw( untrailingslashit( get_rest_url() ) ),
		'apiNonce'   => wp_create_nonce( 'wp_rest' ),
		'brandColor' => get_theme_mod( 'brand_color', '#986dda' ),
		'logo'       => wp_get_attachment_image_url( get_theme_mod( 'custom_logo' ), 'full' ),
		'gmtOffset'  => get_option( 'gmt_offset' ),
		'dateFormat' => get_option( 'date_format' ),
		'userId'     => get_current_user_id(),
		'loginUrl'   => wp_login_url( home_url() ),
		'logoutUrl'  => wp_logout_url( home_url() ),
		'preload'    => array_reduce( apply_filters( 'dones_preload', array(
			'/wp/v2/users'
		) ), 'dones_preload_request', array() ),
		'i18n'       => array(
			'Done'     => _x( 'Done', 'dones' ),
			'Goal'     => _x( 'Goal', 'dones' ),
			'Previous' => _x( 'Previous', 'dones' ),
			'Next'     => _x( 'Next', 'dones' ),
			'Log In'   => _x( 'Log In', 'dones' ),
			'Log Out'  => _x( 'Log Out', 'dones' )
		)
	) );
}
add_action( 'wp_enqueue_scripts', 'dones_scripts' );

/**
 * Append result of internal request to REST API for purpose of preloading
 * data to be attached to the page. Expected to be called in the context of
 * `array_reduce`.
 *
 * @param  array  $memo Reduce accumulator
 * @param  string $path REST API path to preload
 * @return array        Modified reduce accumulator
 */
function dones_preload_request( $memo, $path ) {
	$path_parts = parse_url( $path );

	$request = new WP_REST_Request( 'GET', $path_parts['path'] );
	if ( ! empty( $path_parts['query'] ) ) {
		parse_str( $path_parts['query'], $query_params );
		$request->set_query_params( $query_params );
	}

	$response = rest_do_request( $request );
	if ( 200 === $response->status ) {
		$memo[ $path ] = $response->data;
	}

	return $memo;
}

/**
 * Overrides default preload behavior to include additional data on specific
 * page or in the presence of rewrite query arguments.
 *
 * @param  array $paths REST API paths to preload
 * @return array        Filtered API paths to preload
 */
function dones_page_specific_preload( $paths ) {
	$date = get_query_var( 'dones_date' );
	if ( ! empty( $date ) ) {
		$paths[] = sprintf( '/dones/v1/dones?date=%s', $date );
		$paths[] = '/dones/v1/tags';
	}

	return $paths;
}
add_filter( 'dones_preload', 'dones_page_specific_preload' );

/**
 * Add preconnect for external resources.
 */
function dones_resource_hints( $urls, $relation_type ) {
	if ( 'preconnect' === $relation_type ) {
		$urls[] = array(
			'href' => 'https://fonts.gstatic.com',
			'crossorigin'
		);

		$urls[] = array(
			'href' => 'https://cdn.polyfill.io',
			'crossorigin'
		);
	}

	return $urls;
}
add_filter( 'wp_resource_hints', 'dones_resource_hints', 10, 2 );

/**
 * Add custom fields to the Theme Customizer.
 */
function dones_customize_register( $wp_customize ) {
	// Brand color

	$wp_customize->add_setting( 'brand_color', array(
		'default' => '#986dda'
	) );

	$wp_customize->add_control( new WP_Customize_Color_Control(
		$wp_customize,
		'brand_color',
		array(
			'label'    => __( 'Brand Color', 'dones' ),
			'section'  => 'colors',
			'priority' => 5,
		)
	) );
}
add_action( 'customize_register', 'dones_customize_register' );

/**
 * Initialize Dones REST API controllers.
 */
function dones_create_rest_routes() {
	// Tags
	require_once( dirname( __FILE__ ) . '/inc/endpoints/class-wp-rest-dones-tags-controller.php' );
	$controller = new WP_REST_Dones_Tags_Controller;
	$controller->register_routes();

	// Dones
	require_once( dirname( __FILE__ ) . '/inc/endpoints/class-wp-rest-dones-dones-controller.php' );
	$controller = new WP_REST_Dones_Dones_Controller;
	$controller->register_routes();
}
add_action( 'rest_api_init', 'dones_create_rest_routes' );

/**
 * Add rewrite rules for custom route patterns.
 */
function dones_add_rewrite_rules() {
	add_rewrite_rule( '^date/(\d{4}-\d{2}-\d{2})', 'index.php?dones_date=$matches[1]', 'top' );
	add_rewrite_tag( '%dones_date%', '(\d{4}-\d{2}-\d{2})' );

	if ( 'after_switch_theme' === current_filter() ) {
		global $wp_rewrite;
		$wp_rewrite->flush_rules();
	}
}
add_action( 'init', 'dones_add_rewrite_rules' );
add_action( 'after_switch_theme', 'dones_add_rewrite_rules' );

/**
 * Allow user listing endpoint to include all users, regardless of role and
 * whether published posts exist for the user.
 *
 * @see WP_REST_Users_Controller::get_items
 *
 * @param  array $args Array of arguments for WP_User_Query
 * @return array       Filtered array of arguments for WP_User_Query
 */
function dones_allow_list_user( $args ) {
	unset( $args['has_published_posts'] );
	return $args;
}
add_filter( 'rest_user_query', 'dones_allow_list_user' );
