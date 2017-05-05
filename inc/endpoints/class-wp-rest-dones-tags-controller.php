<?php
/**
 * REST API: WP_REST_Dones_Tags_Controller class
 */

/**
 * Class to access tags via the REST API for use in dones.
 */
class WP_REST_Dones_Tags_Controller extends WP_REST_Controller {
	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route( 'dones/v1', '/tags', array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( $this, 'get_items' )
			),
			'schema' => array( $this, 'get_public_item_schema' )
		) );
	}

	/**
	 * Retrieves a collection of done tags.
	 *
	 * @param  WP_REST_Request           $request Request details
	 * @return WP_REST_Response|WP_Error          Response or WP_Error
	 */
	public function get_items( $request ) {
		return dones_get_tags();
	}

	/**
	 * Retrieves the done's schema, conforming to JSON Schema.
	 *
	 * @return array Item schema data.
	 */
	public function get_item_schema() {
		return array(
			'$schema' => 'http://json-schema.org/schema#',
			'title'   => 'done',
			'type'    => 'array',
			'items'   => array(
				'type' => 'string'
			)
		);
	}
}
