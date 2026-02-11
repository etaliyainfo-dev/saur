<?php
/**
 * Minicart drawer.
 *
 * @package MeeshoUI
 */
if ( ! meesho_ui_is_woocommerce_active() ) {
	return;
}
?>
<div class="meesho-drawer" id="meesho-minicart-drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="meesho-minicart-title">
	<div class="meesho-drawer__overlay js-close-drawer" data-target="meesho-minicart-drawer"></div>
	<aside class="meesho-drawer__panel">
		<header>
			<h2 id="meesho-minicart-title"><?php esc_html_e( 'Your Cart', 'meesho-ui' ); ?></h2>
			<button type="button" class="js-close-drawer" data-target="meesho-minicart-drawer" aria-label="<?php esc_attr_e( 'Close cart drawer', 'meesho-ui' ); ?>">×</button>
		</header>
		<div class="js-minicart-content">
			<?php echo meesho_ui_render_minicart_markup(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<footer>
			<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="button"><?php esc_html_e( 'View cart', 'meesho-ui' ); ?></a>
			<a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="button button-primary"><?php esc_html_e( 'Checkout', 'meesho-ui' ); ?></a>
		</footer>
	</aside>
</div>
