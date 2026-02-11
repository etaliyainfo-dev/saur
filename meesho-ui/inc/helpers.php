<?php
/**
 * Helper functions.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

/**
 * Get customizer option with fallback.
 *
 * @param string $key Option key.
 * @param mixed  $default Fallback.
 * @return mixed
 */
function meesho_ui_get_option( string $key, $default = '' ) {
	$value = get_theme_mod( $key, $default );
	return '' === $value ? $default : $value;
}

/**
 * Whether WooCommerce exists.
 */
function meesho_ui_is_woocommerce_active(): bool {
	return class_exists( 'WooCommerce' );
}

/**
 * Build homepage section order array.
 *
 * @return array<string>
 */
function meesho_ui_home_sections(): array {
	$raw   = (string) meesho_ui_get_option( 'meesho_ui_home_sections_order', 'hero,categories,trending,bestsellers,newarrivals,dealstrip,collections' );
	$items = array_filter( array_map( 'sanitize_key', array_map( 'trim', explode( ',', $raw ) ) ) );
	$valid = array( 'hero', 'categories', 'trending', 'bestsellers', 'newarrivals', 'dealstrip', 'collections' );
	return array_values( array_intersect( $items, $valid ) );
}

/**
 * Build product query args for sections.
 */
function meesho_ui_product_query_args( string $section ): array {
	$args = array(
		'post_type'           => 'product',
		'post_status'         => 'publish',
		'posts_per_page'      => 8,
		'ignore_sticky_posts' => true,
	);

	switch ( $section ) {
		case 'trending':
			$args['meta_key'] = 'total_sales';
			$args['orderby']  = 'meta_value_num';
			break;
		case 'bestsellers':
			$args['meta_key'] = 'total_sales';
			$args['orderby']  = 'meta_value_num';
			break;
		case 'newarrivals':
			$args['orderby'] = 'date';
			$args['order']   = 'DESC';
			break;
	}

	return $args;
}

/**
 * Return wishlist endpoint nonce.
 */
function meesho_ui_nonce( string $action ): string {
	return wp_create_nonce( $action );
}
