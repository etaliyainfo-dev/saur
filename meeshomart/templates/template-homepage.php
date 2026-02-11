<?php
/**
 * Template Name: Homepage
 * Template Post Type: page
 *
 * @package MeeshoMart
 */

get_header();
?>
<div class="mm-homepage">
	<section class="mm-hero mm-container">
		<div class="mm-hero-content">
			<h1><?php esc_html_e( 'Discover Trending Products at Great Prices', 'meeshomart' ); ?></h1>
			<p><?php esc_html_e( 'Browse categories, find deals, and shop from trusted vendors.', 'meeshomart' ); ?></p>
			<a class="button" href="<?php echo esc_url( function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'shop' ) : home_url( '/' ) ); ?>"><?php esc_html_e( 'Shop Now', 'meeshomart' ); ?></a>
		</div>
	</section>

	<?php if ( meeshomart_get_setting( 'meeshomart_show_category_grid', true ) && taxonomy_exists( 'product_cat' ) ) : ?>
		<section class="mm-home-categories mm-container">
			<h2><?php esc_html_e( 'Top Categories', 'meeshomart' ); ?></h2>
			<div class="mm-category-grid">
				<?php
				$terms = get_terms(
					array(
						'taxonomy'   => 'product_cat',
						'hide_empty' => true,
						'number'     => 8,
					)
				);
				if ( ! is_wp_error( $terms ) ) :
					foreach ( $terms as $term ) :
						?>
						<a href="<?php echo esc_url( get_term_link( $term ) ); ?>" class="mm-category-card">
							<span><?php echo esc_html( $term->name ); ?></span>
						</a>
						<?php
					endforeach;
				endif;
				?>
			</div>
		</section>
	<?php endif; ?>

	<?php if ( meeshomart_get_setting( 'meeshomart_show_featured_products', true ) ) : ?>
		<section class="mm-home-featured mm-container">
			<h2><?php esc_html_e( 'Featured Products', 'meeshomart' ); ?></h2>
			<?php echo do_shortcode( '[products visibility="featured" limit="8" columns="4"]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</section>
	<?php endif; ?>

	<section class="mm-home-best-sellers mm-container">
		<h2><?php esc_html_e( 'Best Sellers', 'meeshomart' ); ?></h2>
		<?php echo do_shortcode( '[best_selling_products limit="8" columns="4"]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</section>

	<section class="mm-promo-strip">
		<div class="mm-container">
			<strong><?php esc_html_e( 'Limited Time Offer:', 'meeshomart' ); ?></strong>
			<span><?php esc_html_e( 'Free shipping on orders above ₹499.', 'meeshomart' ); ?></span>
		</div>
	</section>
</div>
<?php
get_footer();
