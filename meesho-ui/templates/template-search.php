<?php
/**
 * Search template body.
 *
 * @package MeeshoUI
 */
?>
<section class="meesho-search-page">
	<h1><?php printf( esc_html__( 'Search results for: %s', 'meesho-ui' ), esc_html( get_search_query() ) ); ?></h1>
	<?php if ( have_posts() ) : ?>
		<div class="meesho-product-grid">
		<?php
		while ( have_posts() ) :
			the_post();
			$product = function_exists( 'wc_get_product' ) ? wc_get_product( get_the_ID() ) : null;
			if ( $product ) {
				get_template_part( 'template-parts/components/product-card', null, array( 'product' => $product ) );
			} else {
				get_template_part( 'template-parts/content', get_post_type() );
			}
		endwhile;
		?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<div class="meesho-empty-state"><?php esc_html_e( 'No products found.', 'meesho-ui' ); ?></div>
	<?php endif; ?>
</section>
