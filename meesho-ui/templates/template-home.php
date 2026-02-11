<?php
/**
 * Template Name: Meesho Home
 *
 * @package MeeshoUI
 */

get_header();
$sections = meesho_ui_home_sections();
foreach ( $sections as $section ) {
	if ( ! meesho_ui_get_option( 'meesho_ui_home_' . $section . '_enabled', true ) ) {
		continue;
	}
	echo '<section class="meesho-home-section section-' . esc_attr( $section ) . '">';
	echo '<h2>' . esc_html( ucfirst( $section ) ) . '</h2>';

	if ( 'hero' === $section ) {
		echo '<div class="meesho-hero"><p>' . esc_html__( 'Daily deals and trending collections.', 'meesho-ui' ) . '</p></div>';
	} elseif ( 'categories' === $section ) {
		$cats = taxonomy_exists( 'product_cat' ) ? get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => true, 'number' => 8 ) ) : array();
		echo '<div class="meesho-category-grid">';
		foreach ( $cats as $cat ) {
			echo '<a href="' . esc_url( get_term_link( $cat ) ) . '">' . esc_html( $cat->name ) . '</a>';
		}
		echo '</div>';
	} else {
		if ( ! function_exists( 'wc_get_product' ) ) { echo '<p>' . esc_html__( 'WooCommerce required for product sections.', 'meesho-ui' ) . '</p></section>'; continue; }
		$query = new WP_Query( meesho_ui_product_query_args( $section ) );
		echo '<div class="meesho-product-grid">';
		while ( $query->have_posts() ) {
			$query->the_post();
			$product = wc_get_product( get_the_ID() );
			if ( $product ) {
				get_template_part( 'template-parts/components/product-card', null, array( 'product' => $product ) );
			}
		}
		wp_reset_postdata();
		echo '</div>';
	}
	echo '</section>';
}
get_footer();
