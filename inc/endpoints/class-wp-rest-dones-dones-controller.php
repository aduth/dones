<?php
/**
 * REST API: WP_REST_Dones_Dones_Controller class
 */

/**
 * Class to access dones via the REST API.
 */
class WP_REST_Dones_Dones_Controller extends WP_REST_Controller {
	/**
	 * Regular expression matching done items in a post's content.
	 *
	 * @type string
	 */
	const REGEXP_DONE = '/^- (✓|✗) (.+?)\s*$/im';

	/**
	 * Regular expression matching tags in a post's content.
	 *
	 * @type string
	 */
	const REGEXP_TAGS = '/(^|\s)#(\S+)\b/';

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
		$users = array();

		foreach ( $query_result as $post ) {
			preg_match_all( self::REGEXP_DONE, $post->post_content, $done_matches, PREG_SET_ORDER );
			if ( in_array( $post->post_author, $users ) ) {
				continue;
			}

			$users[] = $post->post_author;

			foreach ( $done_matches as $index => $done_match ) {
				$dones[] = array(
					'user' => intval( $post->post_author ),
					'text' => $done_match[2],
					'done' => '✓' === $done_match[1]
				);
			}
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
		$post = $this->get_done_post( $request );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		// Assign defaults in case post doesn't already exist
		$post = array_merge( array(
			'ID'           => 0,
			'post_content' => ''
		), (array) $post );

		// Generate done text
		$text = $request['text'];
		$done = $request['done'];
		$content = $this->get_done_text( $text, $done );
		if ( ! empty( $post['post_content'] ) ) {
			$content = $post['post_content'] . "\n" . $content;
		}

		// Generate date string from request or current time
		if ( empty( $request['date'] ) ) {
			$date = current_time( 'Y-m-d' );
		} else {
			$date = $request['date'];
		}

		$user = get_current_user_id();
		$user_data = get_userdata( $user );
		$post_id = wp_insert_post( array(
			'ID'            => $post['ID'],
			'post_author'   => $user,
			'post_title'    => implode( ' - ', array( _x( 'Dones', 'dones' ), $user_data->display_name, $date ) ),
			'post_content'  => $content,
			'post_status'   => 'publish',
			'post_category' => array( get_cat_ID( 'Dones' ) ),
			'post_date'     => $date . ' 00:00:00',
			'tags_input'    => $this->get_post_tags( $content )
		) );

		if ( is_wp_error( $post_id ) || 0 === $post_id ) {
			return new WP_Error( 'rest_cannot_create', _x( 'The done cannot be created.', 'dones' ), array( 'status' => 500 ) );
		}

		return compact( 'user', 'text', 'done' );
	}

	/**
	 * Updates a single done.
	 *
	 * @param  WP_REST_Request           $request Request details
	 * @return WP_REST_Response|WP_Error          Response or WP_Error
	 */
	public function update_item( $request ) {
		$post = $this->get_done_post( $request );
		if ( is_wp_error( $post ) ) {
			return $post;
		}

		if ( empty( $post ) ) {
			return new WP_Error( 'not_found', _x( 'Done not found.', 'dones' ), array( 'status' => 404 ) );
		}

		// Find offset of done by index
		$done_offsets = preg_split( self::REGEXP_DONE, $post->post_content, -1, PREG_SPLIT_OFFSET_CAPTURE );
		$start = $done_offsets[ $request['index'] ][1];
		if ( $request['index'] > 0 ) {
			$start++;
		}
		if ( count( $done_offsets ) > $request['index'] ) {
			$length = $done_offsets[ $request['index'] + 1 ][1] - $start;
		} else {
			$length = PHP_INT_MAX;
		}

		$done = $request['done'];
		$text = $request['text'];

		// If done to be removed, increment length to collapse next line
		if ( empty( $text ) ) {
			$length++;
		}

		// Replace text in content
		$post->post_content = trim( substr_replace(
			$post->post_content,
			$this->get_done_text( $text, $done ),
			$start,
			$length
		) );

		// Update or delete post
		if ( empty( $post->post_content ) ) {
			$success = ( false !== wp_delete_post( $post->ID, true ) );
		} else {
			$success = ( 0 !== wp_update_post( $post ) );
			wp_set_post_tags( $post->ID, $this->get_post_tags( $post->post_content ) );
		}

		if ( ! $success ) {
			return new WP_Error( 'rest_cannot_update', _x( 'The done cannot be updated.', 'dones' ), array( 'status' => 500 ) );
		}

		$user = get_current_user_id();
		return compact( 'user', 'text', 'done' );
	}

	/**
	 * Deletes a single done.
	 *
	 * @param  WP_REST_Request           $request Response details.
	 * @return WP_REST_Response|WP_Error          Response on success, or
	 *                                            WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$response = $this->update_item( $request );
		if ( ! is_wp_error( $response ) ) {
			return array( 'deleted' => true );
		}

		if ( 500 !== $response->get_status() ) {
			return $response;
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
	 * Returns an array of tag strings based on post content passed.
	 *
	 * @param  string $content Post content
	 * @return array           Post tags
	 */
	public function get_post_tags( $content ) {
		preg_match_all( self::REGEXP_TAGS, $content, $tag_matches );
		return $tag_matches[2];
	}

	/**
	 * Tries to find a post corresponding with dones for a given request.
	 *
	 * @param  WP_REST_Request $request Request details
	 * @return WP_Post|null             Post or null if not found
	 */
	public function get_done_post( $request ) {
		$posts_query = new WP_Query();
		$query_result = $posts_query->query( array_merge( array(
			'posts_per_page' => 1,
			'author'         => get_current_user_id()
		), $this->get_done_base_args( $request ) ) );

		return $query_result[0];
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
			'post_type'     => 'post',
			'category_name' => 'Dones',
			'year'          => intval( $date_matches[1] ),
			'monthnum'      => intval( $date_matches[2] ),
			'day'           => intval( $date_matches[3] )
		);
	}

	/**
	 * Returns text to be inserted in post content representing done task.
	 *
	 * @param  string  $text Done text
	 * @param  boolean $done Whether already done or goal
	 * @return string        Done text prepared for post content
	 */
	public function get_done_text( $text, $done ) {
		if ( empty( $text ) ) {
			return '';
		}

		return sprintf( '- %s %s', $done ? '✓' : '✗', $text );
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
