<?php
/**
 * Search template.
 *
 * @package MeeshoMart
 */

get_header();
?>
<div class="mm-container">
	<header class="page-header">
		<h1 class="page-title">
			<?php
			printf(
				/* translators: %s search term. */
				esc_html__( 'Search results for: %s', 'meeshomart' ),
				'<span>' . esc_html( get_search_query() ) . '</span>'
			);
			?>
		</h1>
	</header>
	<?php if ( have_posts() ) : ?>
		<div class="mm-post-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				get_template_part( 'template-parts/components/product-card' );
			endwhile;
			?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<p><?php esc_html_e( 'Nothing matched your search.', 'meeshomart' ); ?></p>
	<?php endif; ?>
</div>
<?php
get_footer();
