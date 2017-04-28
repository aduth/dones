<?php
/**
 * REST API: WP_REST_Dones_Users_Controller class
 */

/**
 * Class to access users via the REST API. Extends WP_REST_Users_Controller to
 * return a subset of properties and filter to users with write access.
 */
class WP_REST_Dones_Users_Controller extends WP_REST_Users_Controller {

	/**
	 * Constructor.
	 *
	 * @access public
	 */
	public function __construct() {
		$this->namespace = 'dones/v1';
		$this->rest_base = 'users';

		$this->meta = new WP_REST_User_Meta_Fields();
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @access public
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
			array(
				'methods'  => WP_REST_Server::READABLE,
				'callback' => array( $this, 'get_items' ),
				'args'     => $this->get_collection_params(),
			),
			'schema' => array( $this, 'get_public_item_schema' ),
		) );
	}

	/**
	 * Retrieves all users.
	 *
	 * @access public
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		// Find roles with `edit_posts` capability
		$roles = wp_roles()->roles;
		$editable_roles = array();
		foreach ( $roles as $role ) {
			if ( $role['capabilities']['edit_posts'] ) {
				$editable_roles[] = $role['name'];
			}
		}

		$query = new WP_User_Query( array(
			'number' => -1,
			'role__in' => $editable_roles
		) );

		$users = array();

		foreach ( $query->results as $user ) {
			$data = $this->prepare_item_for_response( $user, $request );
			$users[] = $this->prepare_response_for_collection( $data );
		}

		$response = rest_ensure_response( $users );

		return $response;
	}

	/**
	 * Adds the values from additional fields to a data object.
	 *
	 * @since 4.7.0
	 * @access protected
	 *
	 * @param array           $object  Data object.
	 * @param WP_REST_Request $request Full details about the request.
	 * @return array Modified data object with additional fields.
	 */
	public function add_additional_fields_to_object( $data, $request ) {
		// If avatars assigned, pick only the largest option
		if ( ! empty( $data['avatar_urls'] ) ) {
			$data['avatar'] = array_pop( $data['avatar_urls'] );
			unset( $data['avatar_urls'] );
		}

		return $data;
	}

	/**
	 * Prepares links for the user request.
	 *
	 * @access protected
	 *
	 * @param WP_User $user User object.
	 * @return array Links for the given user.
	 */
	protected function prepare_links( $user ) {
		return array();
	}

	/**
	 * Retrieves the user's schema, conforming to JSON Schema.
	 *
	 * @access public
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		$schema = parent::get_item_schema();

		$schema['properties'] = array_intersect_key(
			$schema['properties'],
			array_flip( array(
				'id',
				'name',
				'avatar_urls'
			) )
		);

		return $schema;
	}

}
