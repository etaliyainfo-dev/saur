<?php
/**
 * Mobile bottom nav.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;
?>
<nav class="mm-mobile-bottom-nav" aria-label="<?php esc_attr_e( 'Mobile Bottom Navigation', 'meeshomart' ); ?>">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo wp_kses_post( meeshomart_svg_icon( 'home' ) ); ?><span><?php esc_html_e( 'Home', 'meeshomart' ); ?></span></a>
	<a href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' ) ); ?>"><?php echo wp_kses_post( meeshomart_svg_icon( 'grid' ) ); ?><span><?php esc_html_e( 'Categories', 'meeshomart' ); ?></span></a>
	<button type="button" data-mm-focus-search><?php echo wp_kses_post( meeshomart_svg_icon( 'search' ) ); ?><span><?php esc_html_e( 'Search', 'meeshomart' ); ?></span></button>
	<a href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/' ) ); ?>"><?php echo wp_kses_post( meeshomart_svg_icon( 'cart' ) ); ?><span><?php esc_html_e( 'Cart', 'meeshomart' ); ?></span></a>
	<a href="<?php echo esc_url( get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ?: get_option( 'page_on_front' ) ) ); ?>"><?php echo wp_kses_post( meeshomart_svg_icon( 'user' ) ); ?><span><?php esc_html_e( 'Account', 'meeshomart' ); ?></span></a>
</nav>
