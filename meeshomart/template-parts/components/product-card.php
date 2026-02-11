<?php
/**
 * Generic product/content card.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

if ( 'product' === get_post_type() && function_exists( 'wc_get_product' ) ) {
	$product = wc_get_product( get_the_ID() );
	if ( $product ) {
		?>
		<article <?php post_class( 'mm-product-card' ); ?>>
			<a href="<?php the_permalink(); ?>" class="mm-product-thumb"><?php echo wp_kses_post( $product->get_image( 'woocommerce_thumbnail', array( 'loading' => 'lazy' ) ) ); ?></a>
			<div class="mm-product-badges">
				<?php if ( $product->is_on_sale() ) : ?>
					<span class="mm-badge mm-badge-sale"><?php esc_html_e( 'Sale', 'meeshomart' ); ?></span>
				<?php endif; ?>
				<span class="mm-badge mm-badge-delivery"><?php esc_html_e( 'Free Delivery', 'meeshomart' ); ?></span>
			</div>
			<h2 class="mm-product-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
			<div class="mm-product-price"><?php echo wp_kses_post( $product->get_price_html() ); ?></div>
			<div class="mm-rating-placeholder" aria-label="<?php esc_attr_e( 'Product rating', 'meeshomart' ); ?>">★★★★☆</div>
		</article>
		<?php
		return;
	}
}
?>
<article <?php post_class( 'mm-post-card' ); ?>>
	<?php if ( has_post_thumbnail() ) : ?>
		<a href="<?php the_permalink(); ?>" class="mm-post-thumb"><?php the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy' ) ); ?></a>
	<?php endif; ?>
	<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
</article>
