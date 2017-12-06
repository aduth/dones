<?php
/**
 * Utility functions for managing Dones tags querying and caching.
 *
 * @package dones
 */

/**
 * Returns an array of 250 most recently used tag names.
 *
 * @return string[] 250 most recently used tag names.
 */
function dones_get_tags() {
	$tags = get_transient( 'dones_tags' );
	if ( false === $tags ) {
		global $wpdb;
		$tags = $wpdb->get_col( "
			SELECT t.name
				FROM (
					SELECT $wpdb->terms.name, MAX( $wpdb->posts.post_modified ) AS latest_date
						FROM $wpdb->terms
					INNER JOIN $wpdb->term_taxonomy
						ON $wpdb->terms.term_id = $wpdb->term_taxonomy.term_id
					INNER JOIN $wpdb->term_relationships
						ON $wpdb->term_taxonomy.term_taxonomy_id = $wpdb->term_relationships.term_taxonomy_id
					INNER JOIN $wpdb->posts
						ON $wpdb->posts.ID = $wpdb->term_relationships.object_id
					WHERE $wpdb->term_taxonomy.taxonomy = 'done-tag'
					GROUP BY $wpdb->term_taxonomy.term_id
				) AS t
			ORDER BY t.latest_date DESC
			LIMIT 250
		" );

		set_transient( 'dones_tags', $tags );
	}

	return $tags;
}

/**
 * Clears cache for dones tags once tags have been set.
 *
 * @param int    $object_id  Object ID.
 * @param array  $terms      An array of object terms.
 * @param array  $tt_ids     An array of term taxonomy IDs.
 * @param string $taxonomy   Taxonomy slug.
 */
function dones_flush_tags_cache_on_set_object_terms( $object_id, $terms, $tt_ids, $taxonomy ) {
	if ( 'done-tag' === $taxonomy ) {
		delete_transient( 'dones_tags' );
	}
}
add_action( 'set_object_terms', 'dones_flush_tags_cache_on_set_object_terms', 10, 4 );

/**
 * Clears cache for dones tags when deactivating the theme.
 */
function dones_flush_tags_cache_on_switch_theme() {
	delete_transient( 'dones_tags' );
}
add_action( 'switch_theme', 'dones_flush_tags_cache_on_switch_theme' );
