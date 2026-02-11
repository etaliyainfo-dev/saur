<?php
/**
 * Mini cart drawer.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;
if ( ! class_exists( 'WooCommerce' ) ) {
	return;
}
?>
<aside class="mm-minicart-drawer" aria-hidden="true" data-mm-cart-drawer>
	<div class="mm-minicart-overlay" data-mm-close-cart></div>
	<div class="mm-minicart-panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Cart drawer', 'meeshomart' ); ?>">
		<button class="mm-drawer-close" type="button" data-mm-close-cart><?php echo wp_kses_post( meeshomart_svg_icon( 'close' ) ); ?><span class="screen-reader-text"><?php esc_html_e( 'Close cart', 'meeshomart' ); ?></span></button>
		<h2><?php esc_html_e( 'Your Cart', 'meeshomart' ); ?></h2>
		<?php woocommerce_mini_cart(); ?>
	</div>
</aside>
