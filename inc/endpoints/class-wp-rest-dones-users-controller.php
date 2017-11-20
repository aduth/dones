<?php
/**
 * REST API: WP_REST_Dones_Users_Controller class
 *
 * @package dones
 */

/**
 * Class to access users via the REST API. Extends WP_REST_Users_Controller to
 * return a subset of properties and filter to users with write access.
 */
class WP_REST_Dones_Users_Controller extends WP_REST_Controller {

	/**
	 * Avatar sizes to return in response.
	 *
	 * @var array
	 */
	protected static $avatar_sizes = array( 30, 60 );

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @access public
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route( 'dones/v1', 'users', array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		) );
	}

	/**
	 * Retrieves all users.
	 *
	 * @access public
	 *
	 * @param WP_REST_Request $request   Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		// Find roles with `edit_posts` capability.
		$roles          = wp_roles()->roles;
		$editable_roles = array();
		foreach ( $roles as $role ) {
			if ( isset( $role['capabilities']['edit_posts'] ) &&
					$role['capabilities']['edit_posts'] ) {
				$editable_roles[] = $role['name'];
			}
		}

		$query = new WP_User_Query( array(
			'number'   => -1,
			'role__in' => $editable_roles,
		) );

		$users = array();

		foreach ( $query->results as $user ) {
			$data    = $this->prepare_item_for_response( $user, $request );
			$users[] = $this->prepare_response_for_collection( $data );
		}

		$response = rest_ensure_response( $users );

		return $response;
	}

	/**
	 * Prepares a single user output for response.
	 *
	 * @param WP_User         $user    User object.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_item_for_response( $user, $request ) {
		add_filter( 'rest_avatar_sizes', array( $this, 'replace_avatar_sizes' ) );

		$data['id']      = $user->ID;
		$data['name']    = $user->display_name;
		$data['avatars'] = rest_get_avatar_urls( $user->user_email );

		remove_filter( 'rest_avatar_sizes', array( $this, 'replace_avatar_sizes' ) );

		$data = $this->add_additional_fields_to_object( $data, $request );

		return rest_ensure_response( $data );
	}

	/**
	 * Returns an array of avatar sizes for user avatars.
	 *
	 * @return array Avatar sizes.
	 */
	public function replace_avatar_sizes() {
		return self::$avatar_sizes;
	}

	/**
	 * Retrieves the user's schema, conforming to JSON Schema.
	 *
	 * @access public
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		$avatar_sizes = self::$avatar_sizes;

		foreach ( $avatar_sizes as $size ) {
			$avatar_properties[ $size ] = array(
				/* translators: %d: avatar image size in pixels */
				'description' => sprintf( __( 'Avatar URL with image size of %d pixels.', 'dones' ), $size ),
				'type'        => 'string',
				'format'      => 'uri',
			);
		}

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'user',
			'type'       => 'object',
			'properties' => array(
				'id'      => array(
					'description' => __( 'Unique identifier for the user.', 'dones' ),
					'type'        => 'integer',
				),
				'name'    => array(
					'description' => __( 'Display name for the user.', 'dones' ),
					'type'        => 'string',
				),
				'avatars' => array(
					'description' => __( 'Avatar URLs for the user.', 'dones' ),
					'type'        => 'object',
					'properties'  => $avatar_properties,
				),
			),
		);

		return $this->add_additional_fields_schema( $schema );
	}

}
