<?php
/**
 * AJAX product search.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handle AJAX product suggestions.
 */
function meeshomart_ajax_product_search(): void {
	if ( ! check_ajax_referer( 'meeshomart_search_nonce', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => esc_html__( 'Invalid request.', 'meeshomart' ) ), 403 );
	}

	if ( ! class_exists( 'WooCommerce' ) ) {
		wp_send_json_success( array() );
	}

	$term = isset( $_GET['term'] ) ? wc_clean( wp_unslash( $_GET['term'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$term = sanitize_text_field( $term );

	if ( strlen( $term ) < 2 ) {
		wp_send_json_success( array() );
	}

	$cache_key = 'mm_search_' . md5( strtolower( $term ) );
	$cached    = get_transient( $cache_key );
	if ( false !== $cached && is_array( $cached ) ) {
		wp_send_json_success( $cached );
	}

	$query = new WP_Query(
		array(
			'post_type'              => 'product',
			'post_status'            => 'publish',
			'posts_per_page'         => 8,
			's'                      => $term,
			'fields'                 => 'ids',
			'no_found_rows'          => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
		)
	);

	$results = array();
	foreach ( $query->posts as $product_id ) {
		$product = wc_get_product( $product_id );
		if ( ! $product ) {
			continue;
		}

		$results[] = array(
			'id'         => (int) $product_id,
			'title'      => wp_strip_all_tags( $product->get_name() ),
			'price_html' => wp_kses_post( $product->get_price_html() ),
			'permalink'  => esc_url_raw( get_permalink( $product_id ) ),
			'thumb_url'  => esc_url_raw( get_the_post_thumbnail_url( $product_id, 'thumbnail' ) ?: wc_placeholder_img_src() ),
		);
	}

	set_transient( $cache_key, $results, 5 * MINUTE_IN_SECONDS );
	wp_send_json_success( $results );
}
add_action( 'wp_ajax_meeshomart_product_search', 'meeshomart_ajax_product_search' );
add_action( 'wp_ajax_nopriv_meeshomart_product_search', 'meeshomart_ajax_product_search' );
