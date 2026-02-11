<?php
/**
 * Product card component.
 *
 * @package MeeshoUI
 */

if ( ! isset( $args['product'] ) || ! $args['product'] instanceof WC_Product ) {
	return;
}
$product = $args['product'];
?>
<article class="meesho-product-card">
	<a href="<?php echo esc_url( $product->get_permalink() ); ?>" class="meesho-product-card__link">
		<?php echo $product->get_image( 'woocommerce_thumbnail', array( 'loading' => 'lazy' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<h3><?php echo esc_html( wp_trim_words( $product->get_name(), 12 ) ); ?></h3>
	</a>
	<p class="price"><?php echo wp_kses_post( $product->get_price_html() ); ?></p>
	<?php if ( meesho_ui_get_option( 'meesho_ui_show_rating_placeholder', true ) ) : ?>
		<p class="meesho-rating-placeholder"><?php esc_html_e( '⭐ 4.2 (demo)', 'meesho-ui' ); ?></p>
	<?php endif; ?>
	<?php if ( meesho_ui_get_option( 'meesho_ui_show_badges', true ) ) : ?>
		<div class="meesho-badges">
			<?php if ( $product->is_on_sale() ) : ?><span class="badge-sale"><?php esc_html_e( 'Sale', 'meesho-ui' ); ?></span><?php endif; ?>
			<span class="badge-delivery"><?php esc_html_e( 'Fast Delivery', 'meesho-ui' ); ?></span>
		</div>
	<?php endif; ?>
	<button class="button add_to_cart_button ajax_add_to_cart" data-product_id="<?php echo absint( $product->get_id() ); ?>"><?php esc_html_e( 'Quick Add', 'meesho-ui' ); ?></button>
	<button class="button button-link js-wishlist-toggle" data-product-id="<?php echo absint( $product->get_id() ); ?>"><?php esc_html_e( '♡ Wishlist', 'meesho-ui' ); ?></button>
</article>
