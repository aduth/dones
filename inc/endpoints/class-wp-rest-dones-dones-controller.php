<?php
/**
 * REST API: WP_REST_Dones_Dones_Controller class
 *
 * @package dones
 */

/**
 * Class to access dones via the REST API.
 */
class WP_REST_Dones_Dones_Controller extends WP_REST_Posts_Controller {
	/**
	 * Regular expression matching acceptable format of incoming date argument.
	 *
	 * @type string
	 */
	const DATE_REGEXP = '/^(\d{4})-(\d{2})-(\d{2}).*/';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->post_type = 'done';
		$this->namespace = 'dones/v1';
		$this->rest_base = 'dones';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'                => array(
					'date' => array(
						'description' => __( 'The date the done was published, in YYYY-MM-DD format.', 'dones' ),
						'type'        => 'string',
						'arg_options' => array(
							'sanitize_callback' => array( $this, 'sanitize_date' ),
						),
					),
					'page' => array(
						'description' => __( 'When paginating, page of dones to return', 'dones' ),
						'type'        => 'integer',
						'default'     => 1,
					),
					'tag'  => array(
						'description' => __( 'Include dones by tag.', 'dones' ),
						'type'        => 'string',
					),
				),
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'create_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE ),
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		) );

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', array(
			'args'   => array(
				'id' => array(
					'description' => __( 'Unique identifier for the object.', 'dones' ),
					'type'        => 'integer',
				),
			),
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'update_item_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE ),
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_item' ),
				'permission_callback' => array( $this, 'delete_item_permissions_check' ),
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		) );
	}

	/**
	 * Retrieves a collection of dones.
	 *
	 * @param WP_REST_Request $request   Request details.
	 * @return WP_REST_Response|WP_Error Response or WP_Error.
	 */
	public function get_items( $request ) {
		$args = $this->get_done_base_args( $request );
		if ( is_wp_error( $args ) ) {
			return $args;
		}

		$posts_query  = new WP_Query();
		$query_result = $posts_query->query( $args );

		$dones = array();
		foreach ( $query_result as $post ) {
			$dones[] = $this->prepare_item_for_response( $post, $request );
		}

		$response = rest_ensure_response( $dones );

		// Add pagination headers.
		$per_page    = (int) $posts_query->query_vars['posts_per_page'];
		$total_dones = (int) $posts_query->found_posts;
		$total_pages = -1 === $per_page ? 1 : ceil( $total_dones / $per_page );
		$response->header( 'X-WP-Total', $total_dones );
		$response->header( 'X-WP-TotalPages', $total_pages );

		return $response;
	}

	/**
	 * Creates a single post.
	 *
	 * @param WP_REST_Request $request   Request details.
	 * @return WP_REST_Response|WP_Error Response or WP_Error.
	 */
	public function create_item( $request ) {
		$post       = array(
			'post_type'   => 'done',
			'post_author' => get_current_user_id(),
			'post_title'  => $request['text'],
			'post_status' => $request['done'] ? 'publish' : 'draft',
			'post_date'   => $request['date'],
		);
		$post['ID'] = wp_insert_post( $post );

		if ( is_wp_error( $post['ID'] ) || 0 === $post['ID'] ) {
			return new WP_Error( 'rest_cannot_create', __( 'The done cannot be created.', 'dones' ), array( 'status' => 500 ) );
		}

		return $this->prepare_item_for_response( (object) $post, $request );
	}

	/**
	 * Updates a single done.
	 *
	 * @param WP_REST_Request $request   Request details.
	 * @return WP_REST_Response|WP_Error Response or WP_Error.
	 */
	public function update_item( $request ) {
		$post = $this->get_done_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$done = $request['done'];
		$text = $request['text'];

		// Update or delete post.
		if ( empty( $text ) ) {
			return $this->delete_item( $request );
		}

		// Replace text in content.
		$post->post_title  = $text;
		$post->post_status = $done ? 'publish' : 'draft';
		$success           = ( 0 !== wp_update_post( $post ) );

		if ( ! $success ) {
			return new WP_Error( 'rest_cannot_update', __( 'The done cannot be updated.', 'dones' ), array( 'status' => 500 ) );
		}

		return $this->prepare_item_for_response( $post, $request );
	}

	/**
	 * Deletes a single done.
	 *
	 * @param WP_REST_Request $request   Response details.
	 * @return WP_REST_Response|WP_Error Response on success, or WP_Error.
	 */
	public function delete_item( $request ) {
		$post = $this->get_done_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( false !== wp_delete_post( $post->ID, true ) ) {
			return array( 'deleted' => true );
		}

		return new WP_Error( 'rest_cannot_delete', __( 'The done cannot be deleted.', 'dones' ), array( 'status' => 500 ) );
	}

	/**
	 * Tries to find a post corresponding with dones for a given request.
	 *
	 * @param int $id       Post ID.
	 * @return WP_Post|null Post or null if not found.
	 */
	public function get_done_post( $id ) {
		$post = get_post( $id );

		if ( is_null( $post ) || get_current_user_id() !== (int) $post->post_author ) {
			return new WP_Error( 'not_found', __( 'Done not found.', 'dones' ), array( 'status' => 404 ) );
		}

		return $post;
	}

	/**
	 * Returns an array of done properties prepared for API response.
	 *
	 * @param WP_Post         $post    Post object.
	 * @param WP_REST_Request $request Request object.
	 * @return array                   Response array.
	 */
	public function prepare_item_for_response( $post, $request ) {
		return array(
			'id'   => $post->ID,
			'user' => (int) $post->post_author,
			'text' => $post->post_title,
			'date' => $post->post_date,
			'done' => ( 'draft' !== $post->post_status ),
		);
	}

	/**
	 * Returns an array of base arguments to retrieve done post via WP_Query.
	 *
	 * @param WP_REST_Request $request Request details.
	 * @return array                   Base WP_Query arguments.
	 */
	public function get_done_base_args( $request ) {
		$args = array(
			'post_type'   => 'done',
			'post_status' => array( 'publish', 'draft', 'future' ),
			'orderby'     => 'date',
			'order'       => 'desc',
			'paged'       => (int) $request['page'],
		);

		if ( ! empty( $request['date'] ) ) {
			// Assumed to match by sanitization.
			preg_match( self::DATE_REGEXP, $request['date'], $date_matches );

			$args['year']           = (int) $date_matches[1];
			$args['monthnum']       = (int) $date_matches[2];
			$args['day']            = (int) $date_matches[3];
			$args['posts_per_page'] = -1;
		}

		if ( ! empty( $request['tag'] ) ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'done-tag',
					'field'    => 'slug',
					'terms'    => $request['tag'],
				),
			);
		}

		return $args;
	}

	/**
	 * Enforces and coerces incoming date value to proper format.
	 *
	 * @param string $value Incoming date.
	 * @return string       Formatted date.
	 */
	public function sanitize_date( $value ) {
		// Default to now if empty, invalid, or occurring today.
		if ( empty( $value ) || ! preg_match( self::DATE_REGEXP, $value ) ||
				current_time( 'Y-m-d' ) === $value ) {
			return current_time( 'Y-m-d H:i:s' );
		}

		return preg_replace( self::DATE_REGEXP, '$1-$2-$3 00:00:00', $value );
	}

	/**
	 * Retrieves the done's schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		return array(
			'$schema'    => 'http://json-schema.org/schema#',
			'title'      => 'done',
			'type'       => 'object',
			'properties' => array(
				'id'    => array(
					'description' => __( 'ID of the done post object.', 'dones' ),
					'type'        => 'integer',
					'readonly'    => true,
				),
				'user'  => array(
					'description' => __( 'Unique identifier of user to which the done belongs.', 'dones' ),
					'type'        => 'integer',
					'readonly'    => true,
				),
				'text'  => array(
					'description' => __( 'Text of the task completed.', 'dones' ),
					'type'        => 'string',
				),
				'done'  => array(
					'description' => __( 'Whether the task has been completed or is a goal to be accomplished.', 'dones' ),
					'type'        => 'boolean',
					'default'     => true,
				),
				'date'  => array(
					'description' => __( 'The date the done was published.', 'dones' ),
					'type'        => 'string',
					'arg_options' => array(
						'sanitize_callback' => array( $this, 'sanitize_date' ),
					),
				),
				'index' => array(
					'description' => __( 'Index of the done to be updated.', 'dones' ),
					'type'        => 'integer',
				),
			),
		);
	}
}
