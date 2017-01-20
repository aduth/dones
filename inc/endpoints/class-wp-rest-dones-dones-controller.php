<?php
/**
 * REST API: WP_REST_Dones_Dones_Controller class
 */

/**
 * Class to access dones via the REST API.
 */
class WP_REST_Dones_Dones_Controller extends WP_REST_Controller {
	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route( 'dones/v1', '/dones', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' ),
				'args'                => array(
					'date'            => array(
						'description' => _x( 'The date the done was published, in YYYY-MM-DD format.', 'dones' ),
						'type'        => 'string'
					)
				)
			),
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'create_item' ),
				'permission_callback' => array( $this, 'is_logged_in_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::CREATABLE )
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		) );


		register_rest_route( 'dones/v1', '/dones/(?P<id>[\d]+)', array(
			array(
				'methods'             => WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'update_item' ),
				'permission_callback' => array( $this, 'is_logged_in_permissions_check' ),
				'args'                => $this->get_endpoint_args_for_item_schema( WP_REST_Server::EDITABLE )
			),
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( $this, 'delete_item' ),
				'permission_callback' => array( $this, 'is_logged_in_permissions_check' )
			),
			'schema' => array( $this, 'get_public_item_schema' )
		) );
	}

	/**
	 * Retrieves a collection of dones.
	 *
	 * @param  WP_REST_Request           $request Request details
	 * @return WP_REST_Response|WP_Error          Response or WP_Error
	 */
	public function get_items( $request ) {
		$args = $this->get_done_base_args( $request );
		if ( is_wp_error( $args ) ) {
			return $args;
		}

		$posts_query = new WP_Query();
		$query_result = $posts_query->query( $args );

		$dones = array();
		foreach ( $query_result as $post ) {
			$dones[] = $this->prepare_item_for_response( $post, $request );
		}

		return $dones;
	}

	/**
	 * Creates a single post.
	 *
	 * @param  WP_REST_Request           $request Request details
	 * @return WP_REST_Response|WP_Error          Response or WP_Error
	 */
	public function create_item( $request ) {
		// Generate date string from request or current time
		if ( empty( $request['date'] ) ) {
			$date = current_time( 'Y-m-d' );
		} else {
			$date = $request['date'];
		}

		$post = array(
			'post_type'   => 'done',
			'post_author' => get_current_user_id(),
			'post_title'  => $request['text'],
			'post_status' => $request['done'] ? 'publish' : 'draft',
			'post_date'   => $date . ' 00:00:00',
		);
		$post['ID'] = wp_insert_post( $post );

		if ( is_wp_error( $post['ID'] ) || 0 === $post['ID'] ) {
			return new WP_Error( 'rest_cannot_create', _x( 'The done cannot be created.', 'dones' ), array( 'status' => 500 ) );
		}

		return $this->prepare_item_for_response( (object) $post, $request );
	}

	/**
	 * Updates a single done.
	 *
	 * @param  WP_REST_Request           $request Request details
	 * @return WP_REST_Response|WP_Error          Response or WP_Error
	 */
	public function update_item( $request ) {
		$post = $this->get_done_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		$done = $request['done'];
		$text = $request['text'];

		// Update or delete post
		if ( empty( $text ) ) {
			return $this->delete_item( $request );
		}

		// Replace text in content
		$post->post_title = $text;
		$post->post_status = $done ? 'publish' : 'draft';
		$success = ( 0 !== wp_update_post( $post ) );

		if ( ! $success ) {
			return new WP_Error( 'rest_cannot_update', _x( 'The done cannot be updated.', 'dones' ), array( 'status' => 500 ) );
		}

		return $this->prepare_item_for_response( $post, $request );
	}

	/**
	 * Deletes a single done.
	 *
	 * @param  WP_REST_Request           $request Response details.
	 * @return WP_REST_Response|WP_Error          Response on success, or
	 *                                            WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$post = $this->get_done_post( $request['id'] );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( false !== wp_delete_post( $post->ID, true ) ) {
			return array( 'deleted' => true );
		}

		return new WP_Error( 'rest_cannot_delete', _x( 'The done cannot be deleted.', 'dones' ), array( 'status' => 500 ) );
	}

	/**
	 * Checks if a given request has access to create a post.
	 *
	 * @param  WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error            True if the request has access to
	 *                                  create items, WP_Error object otherwise.
	 */
	public function is_logged_in_permissions_check( $request ) {
		if ( ! is_user_logged_in() ) {
			return new WP_error( 'rest_unauthorized', _x( 'You must be logged in to create dones.', 'dones' ), array( 'status' => rest_authorization_required_code() ) );
		}

		return true;
	}

	/**
	 * Tries to find a post corresponding with dones for a given request.
	 *
	 * @param  WP_REST_Request $request Request details
	 * @return WP_Post|null             Post or null if not found
	 */
	public function get_done_post( $id ) {
		$post = get_post( $id );

		if ( is_null( $post ) || (int) $post->post_author !== get_current_user_id() ) {
			return new WP_Error( 'not_found', __( 'Done not found.', 'dones' ), array( 'status' => 404 ) );
		}

		return $post;
	}

	/**
	 * Returns an array of done properties prepared for API response.
	 *
	 * @param  WP_Post $post Post object
	 * @return array         Response array
	 */
	public function prepare_item_for_response( $post, $request ) {
		return array(
			'id'   => $post->ID,
			'user' => (int) $post->post_author,
			'text' => $post->post_title,
			'date' => $post->post_date,
			'done' => ( 'publish' === $post->post_status )
		);
	}

	/**
	 * Returns an array of base arguments to retrieve done post via WP_Query.
	 *
	 * @param  WP_REST_Request $request Request details
	 * @return array                    Base WP_Query arguments
	 */
	public function get_done_base_args( $request ) {
		if ( empty( $request['date'] ) ) {
			$date = current_time( 'Y-m-d' );
		} else {
			$date = $request['date'];
		}

		if ( ! preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $date, $date_matches ) ) {
			return new WP_Error( 'invalid_input', _x( 'Invalid date.', 'dones' ) );
		}

		return array(
			'post_type'   => 'done',
			'post_status' => array( 'publish', 'draft' ),
			'order'       => 'asc',
			'year'        => (int) $date_matches[1],
			'monthnum'    => (int) $date_matches[2],
			'day'         => (int) $date_matches[3]
		);
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
				'id'              => array(
					'description' => __( 'ID of the done post object.', 'dones' ),
					'type'        => 'integer',
					'readonly'    => true,
				),
				'user'            => array(
					'description' => _x( 'Unique identifier of user to which the done belongs.', 'dones' ),
					'type'        => 'integer',
					'readonly'    => true
				),
				'text'            => array(
					'description' => _x( 'Text of the task completed.', 'dones' ),
					'type'        => 'string'
				),
				'done'            => array(
					'description' => _x( 'Whether the task has been completed or is a goal to be accomplished.', 'dones' ),
					'type'        => 'boolean',
					'default'     => true
				),
				'date'            => array(
					'description' => _x( 'The date the done was published, in YYYY-MM-DD format.', 'dones' ),
					'type'        => 'string'
				),
				'index'           => array(
					'description' => _x( 'Index of the done to be updated.', 'dones' ),
					'type'        => 'integer'
				)
			)
		);
	}
}
