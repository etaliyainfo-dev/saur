<?php
/**
 * Mobile bottom nav.
 *
 * @package MeeshoUI
 */
?>
<nav class="meesho-mobile-nav" aria-label="<?php esc_attr_e( 'Mobile bottom navigation', 'meesho-ui' ); ?>">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'meesho-ui' ); ?></a>
	<a href="<?php echo esc_url( meesho_ui_is_woocommerce_active() ? get_permalink( wc_get_page_id( 'shop' ) ) : home_url( '/shop' ) ); ?>"><?php esc_html_e( 'Categories', 'meesho-ui' ); ?></a>
	<button type="button" class="js-focus-search"><?php esc_html_e( 'Search', 'meesho-ui' ); ?></button>
	<a href="<?php echo esc_url( home_url( '/wishlist' ) ); ?>"><?php esc_html_e( 'Wishlist', 'meesho-ui' ); ?></a>
	<a href="<?php echo esc_url( meesho_ui_is_woocommerce_active() ? wc_get_cart_url() : wp_login_url() ); ?>"><?php esc_html_e( 'Cart/Account', 'meesho-ui' ); ?></a>
</nav>
