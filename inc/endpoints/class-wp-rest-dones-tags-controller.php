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
		global $wpdb;
		return $wpdb->get_col( "
			SELECT name FROM $wpdb->terms
			INNER JOIN $wpdb->term_taxonomy ON $wpdb->terms.term_id = $wpdb->term_taxonomy.term_id
			INNER JOIN $wpdb->term_relationships ON $wpdb->term_taxonomy.term_taxonomy_id = $wpdb->term_relationships.term_taxonomy_id
			INNER JOIN $wpdb->posts ON $wpdb->posts.ID = $wpdb->term_relationships.object_id
			WHERE $wpdb->term_taxonomy.taxonomy = 'post_tag'
			GROUP BY $wpdb->terms.term_id
			ORDER BY $wpdb->posts.post_modified DESC
			LIMIT 250
		" );
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
