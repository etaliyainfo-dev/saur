<?php
/**
 * Wishlist page template.
 */

defined( 'ABSPATH' ) || exit;

$wishlist = Meesho_UI_Addons_Wishlist::instance();
$items    = $wishlist->get_items( get_current_user_id() );
?>
<section class="meesho-wishlist-page">
	<h1><?php esc_html_e( 'My Wishlist', 'meesho-ui-addons' ); ?></h1>
	<?php if ( empty( $items ) ) : ?>
		<p class="meesho-empty-state"><?php esc_html_e( 'No wishlist items yet.', 'meesho-ui-addons' ); ?></p>
	<?php else : ?>
		<ul class="meesho-wishlist-grid">
			<?php foreach ( $items as $item_id ) : ?>
				<?php $product = function_exists( 'wc_get_product' ) ? wc_get_product( $item_id ) : null; ?>
				<?php if ( ! $product ) { continue; } ?>
				<li>
					<a href="<?php echo esc_url( $product->get_permalink() ); ?>"><?php echo esc_html( $product->get_name() ); ?></a>
					<span><?php echo wp_kses_post( $product->get_price_html() ); ?></span>
					<button class="js-wishlist-toggle" data-product-id="<?php echo absint( $product->get_id() ); ?>" data-mode="remove"><?php esc_html_e( 'Remove', 'meesho-ui-addons' ); ?></button>
					<?php if ( function_exists( 'wc_get_cart_url' ) ) : ?>
						<a href="<?php echo esc_url( '?add-to-cart=' . absint( $product->get_id() ) ); ?>" class="button"><?php esc_html_e( 'Move to cart', 'meesho-ui-addons' ); ?></a>
					<?php endif; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>
</section>
