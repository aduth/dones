<?php

require( dirname( __FILE__ ) . '/inc/tags.php' );

/**
 * Returns the current version of the theme.
 *
 * @return string Theme version
 */
function dones_get_version() {
	$theme = wp_get_theme();
	return $theme->get( 'Version' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function dones_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'custom-logo', array(
		'width'  => 120,
		'height' => 120
	) );
}
add_action( 'after_setup_theme', 'dones_setup' );

/**
 * Bypass default document title, deferred to be handled on client.
 *
 * @return string Title override (site name)
 */
function dones_custom_document_title() {
	return get_bloginfo( 'name', 'display' );
}
add_filter( 'pre_get_document_title', 'dones_custom_document_title' );

/**
 * Enqueue scripts and styles.
 */
function dones_scripts() {
	// Add custom fonts.
	wp_enqueue_style( 'dones-fonts', 'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,300', array(), null );

	// Theme stylesheet.
	wp_enqueue_style( 'dones-style', get_theme_file_uri( '/dist/style.css' ), array(), dones_get_version() );
	wp_add_inline_style( 'dones-style', sprintf( 'a { color: %s; }', get_theme_mod( 'brand_color', '#986dda' ) ) );

	// Custom logo with fallback.
	$custom_logo_id = get_theme_mod( 'custom_logo' );
	if ( $custom_logo_id ) {
		$logo = wp_get_attachment_image_url( $custom_logo_id, 'full' );
	} else {
		$logo = get_theme_file_uri( '/img/logo.svg' );
	}

	// Application script.
	wp_register_script( 'dones-polyfill', add_query_arg( array(
		'features' => 'fetch'
	), 'https://cdn.polyfill.io/v2/polyfill.min.js' ) );
	wp_register_script( 'dones-vendor', get_theme_file_uri( '/dist/vendor.js' ), array(), dones_get_version() );
	wp_enqueue_script( 'dones-app', get_theme_file_uri( '/dist/app.js' ), array( 'dones-polyfill', 'dones-vendor' ), dones_get_version(), true );
	wp_localize_script( 'dones-app', 'dones', array(
		'siteName'   => get_bloginfo( 'name' ),
		'apiRoot'    => esc_url_raw( untrailingslashit( get_rest_url() ) ),
		'apiNonce'   => wp_create_nonce( 'wp_rest' ),
		'brandColor' => get_theme_mod( 'brand_color', '#986dda' ),
		'logo'       => $logo,
		'gmtOffset'  => get_option( 'gmt_offset' ),
		'dateFormat' => get_option( 'date_format' ),
		'userId'     => get_current_user_id(),
		'loginUrl'   => wp_login_url( home_url() ),
		'logoutUrl'  => wp_logout_url( home_url() ),
		'preload'    => array_reduce( apply_filters( 'dones_preload', array(
			'/dones/v1/users'
		) ), 'dones_preload_request', array() ),
		'i18n'       => array(
			'Cancel'                    => __( 'Cancel', 'dones' ),
			'Date'                      => __( 'Date', 'dones' ),
			'Done'                      => __( 'Done', 'dones' ),
			'Done or goal'              => __( 'Done or goal', 'dones' ),
			'Dones'                     => __( 'Dones', 'dones' ),
			'Goal'                      => __( 'Goal', 'dones' ),
			'Log In'                    => __( 'Log In', 'dones' ),
			'Log Out'                   => __( 'Log Out', 'dones' ),
			'Next'                      => __( 'Next', 'dones' ),
			'Page Not Found'            => __( 'Page Not Found', 'dones' ),
			'Pick Date'                 => __( 'Pick Date', 'dones' ),
			'Previous'                  => __( 'Previous', 'dones' ),
			'Submit'                    => __( 'Submit', 'dones' ),
			'Tag: %s'                   => __( 'Tag: %s', 'dones' ),
			'Tags'                      => __( 'Tags', 'dones' ),
			'User avatar'               => __( 'User avatar', 'dones' ),
			'What have you been up to?' => __( 'What have you been up to?', 'dones' )
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
	global $wp_query;

	// Dones
	$date = get_query_var( 'dones_date' );
	if ( ! empty( $date ) ) {
		$paths[] = sprintf( '/dones/v1/dones?date=%s', $date );
	}

	// Single tag
	$tag = get_query_var( 'dones_tag' );
	if ( ! empty( $tag ) ) {
		$paths[] = sprintf( '/dones/v1/dones?tag=%s', $tag );
	}

	// Tag root or single tag
	if ( isset( $wp_query->query_vars['dones_tag'] ) ) {
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
		'default'           => '#986dda',
		'sanitize_callback' => 'sanitize_hex_color'
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

	// Users
	require_once( dirname( __FILE__ ) . '/inc/endpoints/class-wp-rest-dones-users-controller.php' );
	$controller = new WP_REST_Dones_Users_Controller;
	$controller->register_routes();
}
add_action( 'rest_api_init', 'dones_create_rest_routes' );

/**
 * Add rewrite rules for custom route patterns.
 */
function dones_add_rewrite_rules() {
	add_rewrite_rule( '^date(/(\d{4}-\d{2}-\d{2}))?/?$', 'index.php?dones_date=$matches[2]', 'top' );
	add_rewrite_tag( '%dones_date%', '\d{4}-\d{2}-\d{2}' );
	add_rewrite_rule( '^tags(/(\S+))?/?$', 'index.php?dones_tag=$matches[2]', 'top' );
	add_rewrite_tag( '%dones_tag%', '\w+' );

	if ( 'after_switch_theme' === current_filter() ) {
		global $wp_rewrite;
		$wp_rewrite->flush_rules();
	}
}
add_action( 'init', 'dones_add_rewrite_rules' );
add_action( 'after_switch_theme', 'dones_add_rewrite_rules' );

/**
 * Redirect to current date for root path requests.
 */
function dones_home_redirect() {
	global $wp;
	if ( home_url() === home_url( $wp->request ) ) {
		wp_safe_redirect( home_url( '/date/' . date_i18n( 'Y-m-d' ) ) );
		exit;
	}
}
add_action( 'template_redirect', 'dones_home_redirect' );

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

/**
 * Register custom post types and taxonomies.
 */
function dones_register_custom_types() {
	// Done custom post type
	register_post_type( 'done', array(
		'labels'                 => array(
			'name'               => _x( 'Dones', 'post type general name', 'dones' ),
			'singular_name'      => _x( 'Done', 'post type singular name', 'dones' ),
			'menu_name'          => _x( 'Dones', 'admin menu', 'dones' ),
			'name_admin_bar'     => _x( 'Done', 'add new on admin bar', 'dones' ),
			'add_new'            => _x( 'Add New', 'done', 'dones' ),
			'add_new_item'       => __( 'Add New Done', 'dones' ),
			'new_item'           => __( 'New Done', 'dones' ),
			'edit_item'          => __( 'Edit Done', 'dones' ),
			'view_item'          => __( 'View Done', 'dones' ),
			'all_items'          => __( 'All Dones', 'dones' ),
			'search_items'       => __( 'Search Dones', 'dones' ),
			'parent_item_colon'  => null,
			'not_found'          => __( 'No dones found.', 'dones' ),
			'not_found_in_trash' => __( 'No dones found in Trash.', 'dones' ),
		),
		'description'            => __( 'Tasks completed or to be completed.', 'dones' ),
		'public'                 => true,
		'show_ui'                => true,
		'has_archive'            => false,
		'show_in_menu'           => true,
		'menu_icon'              => 'dashicons-list-view',
		'exclude_from_search'    => true,
		'capability_type'        => 'post',
		'map_meta_cap'           => true,
		'rewrite'                => false,
		'query_var'              => false,
		'supports'               => array( 'title', 'author' ),
	) );

	// Done tag custom taxonomy
	register_taxonomy( 'done-tag', 'done', array(
		'labels'                => array(
			'name'              => _x( 'Done Tags', 'taxonomy general name', 'dones' ),
			'singular_name'     => _x( 'Done Tag', 'taxonomy singular name', 'dones' ),
			'search_items'      => __( 'Search Done Tags', 'dones' ),
			'all_items'         => __( 'All Done Tags', 'dones' ),
			'parent_item'       => null,
			'parent_item_colon' => null,
			'edit_item'         => __( 'Edit Done Tag', 'dones' ),
			'update_item'       => __( 'Update Done Tag', 'dones' ),
			'add_new_item'      => __( 'Add New Done Tag', 'dones' ),
			'new_item_name'     => __( 'New Done Tag Name', 'dones' ),
			'menu_name'         => __( 'Done Tag', 'dones' ),
		),
		'rewrite'               => false,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'query_var'             => false,
		'public'                => true,
		'update_count_callback' => '_update_post_term_count',
	) );
}
add_action( 'init', 'dones_register_custom_types' );

/**
 * Removes the Done Tags column from the manage (admin) list view
 */
function dones_remove_tags_manage_column( $columns ) {
	unset( $columns['taxonomy-done-tag'] );
	$columns['title'] = _x( 'Done Text', 'manage column name', 'dones' );
	return $columns;
}
add_filter( 'manage_done_posts_columns', 'dones_remove_tags_manage_column' );

/**
 * Filters the default rewrite rules array, returning only those explicitly
 * supported by the theme.
 *
 * @param  array $rules Original rewrite rules
 * @return array        Revised rewrite rules
 */
function dones_filter_supported_rewrites( $rules ) {
	$rules_to_keep = array(
		// Default rules
		'^wp-json/?$',
		'^wp-json/(.*)?',
		'robots\.txt$',
		'feed/(feed|rdf|rss|rss2|atom)/?$',
		'(feed|rdf|rss|rss2|atom)/?$',
		'embed/?$',

		// Dones rules
		'^date(/(\d{4}-\d{2}-\d{2}))?/?$',
		'^tags(/(\S+))?/?$'
	);

	$filtered_rules = array();
	foreach ( $rules_to_keep as $key ) {
		$filtered_rules[ $key ] = $rules[ $key ];
	}

    return $filtered_rules;
}
add_filter( 'rewrite_rules_array', 'dones_filter_supported_rewrites' );

/**
 * Reassigns tags for done post upon save, generated from title.
 *
 * @param int     $post_id Post ID
 * @param WP_Post $post    Post object
 */
function dones_assign_done_tags( $post_id, $post ) {
	preg_match_all( '/(^|\s)#(\S+)\b/', $post->post_title, $tag_matches );
	$tags = $tag_matches[2];
	wp_set_post_terms( $post_id, $tags, 'done-tag' );
}
add_action( 'save_post_done', 'dones_assign_done_tags', 10, 2 );

/**
 * Returns a default icon URL resource if a site icon isn't configured.
 *
 * @param  string $url Site icon URL
 * @return string $url Site icon URL, or default value
 */
function dones_default_site_icon( $url, $size ) {
	$icon_sizes = array( '32', '180', '192', '270', '512' );
	if ( empty( $url ) && in_array( $size, $icon_sizes ) ) {
		return get_theme_file_uri( sprintf( '/img/icon-%d.png', $size ) );
	}

	return $url;
}
add_filter( 'get_site_icon_url', 'dones_default_site_icon', 10, 2 );
