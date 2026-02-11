<?php
/**
 * Template Name: Meesho Categories
 *
 * @package MeeshoUI
 */

get_header();
?>
<section class="meesho-category-page">
	<h1><?php esc_html_e( 'Shop by Category', 'meesho-ui' ); ?></h1>
	<div class="meesho-category-grid">
		<?php
		$categories = taxonomy_exists( 'product_cat' ) ? get_terms( array( 'taxonomy' => 'product_cat', 'hide_empty' => true ) ) : array();
		foreach ( $categories as $category ) {
			echo '<a href="' . esc_url( get_term_link( $category ) ) . '">' . esc_html( $category->name ) . '</a>';
		}
		?>
	</div>
</section>
<?php
get_footer();
