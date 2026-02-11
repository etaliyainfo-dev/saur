<?php
/**
 * WooCommerce compatibility.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Add WooCommerce support.
 */
function meeshomart_woocommerce_support(): void {
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'meeshomart_woocommerce_support' );

/**
 * Cart fragments update.
 *
 * @param array<string, string> $fragments Fragments.
 * @return array<string, string>
 */
function meeshomart_cart_fragments( array $fragments ): array {
	if ( ! function_exists( 'WC' ) || ! WC()->cart ) {
		return $fragments;
	}

	ob_start();
	?>
	<span class="mm-cart-count"><?php echo esc_html( (string) WC()->cart->get_cart_contents_count() ); ?></span>
	<?php
	$fragments['.mm-cart-count'] = ob_get_clean();
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'meeshomart_cart_fragments' );

/**
 * Open custom product card wrapper.
 */
function meeshomart_product_card_open(): void {
	echo '<article class="mm-product-card">';
}
add_action( 'woocommerce_before_shop_loop_item', 'meeshomart_product_card_open', 5 );

/**
 * Free delivery badge in loop.
 */
function meeshomart_loop_badges(): void {
	global $product;
	if ( ! $product instanceof WC_Product ) {
		return;
	}
	echo '<div class="mm-product-badges">';
	if ( $product->is_on_sale() ) {
		echo '<span class="mm-badge mm-badge-sale">' . esc_html__( 'Sale', 'meeshomart' ) . '</span>';
	}
	echo '<span class="mm-badge mm-badge-delivery">' . esc_html__( 'Free Delivery', 'meeshomart' ) . '</span>';
	echo '</div>';
}
add_action( 'woocommerce_before_shop_loop_item_title', 'meeshomart_loop_badges', 15 );

/**
 * Rating placeholder in loop.
 */
function meeshomart_rating_placeholder(): void {
	echo '<div class="mm-rating-placeholder" aria-label="' . esc_attr__( 'Product rating', 'meeshomart' ) . '">★★★★☆</div>';
}
add_action( 'woocommerce_after_shop_loop_item_title', 'meeshomart_rating_placeholder', 6 );

/**
 * Close custom product card wrapper.
 */
function meeshomart_product_card_close(): void {
	echo '</article>';
}
add_action( 'woocommerce_after_shop_loop_item', 'meeshomart_product_card_close', 20 );

/**
 * Add minicart drawer markup in footer.
 */
function meeshomart_minicart_drawer_markup(): void {
	if ( ! class_exists( 'WooCommerce' ) ) {
		return;
	}
	get_template_part( 'template-parts/components/minicart', 'drawer' );
}
add_action( 'wp_footer', 'meeshomart_minicart_drawer_markup', 30 );

/**
 * Add mobile filter drawer in shop pages.
 */
function meeshomart_filter_drawer_markup(): void {
	if ( ! function_exists( 'is_shop' ) ) {
		return;
	}
	if ( is_shop() || is_product_taxonomy() ) {
		get_template_part( 'template-parts/components/filter', 'drawer' );
	}
}
add_action( 'wp_footer', 'meeshomart_filter_drawer_markup', 35 );

/**
 * Add vendor class on body.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function meeshomart_vendor_body_class( array $classes ): array {
	if ( class_exists( 'WeDevs_Dokan' ) ) {
		$classes[] = 'mm-vendor-dokan';
	}
	if ( defined( 'WCFM_VERSION' ) ) {
		$classes[] = 'mm-vendor-wcfm';
	}
	if ( class_exists( 'WC_Vendors' ) ) {
		$classes[] = 'mm-vendor-wcvendors';
	}
	return $classes;
}
add_filter( 'body_class', 'meeshomart_vendor_body_class' );
