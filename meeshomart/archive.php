<?php
/**
 * Archive template.
 *
 * @package MeeshoMart
 */

get_header();
?>
<div class="mm-container">
	<header class="page-header">
		<h1 class="page-title"><?php the_archive_title(); ?></h1>
	</header>
	<?php if ( have_posts() ) : ?>
		<?php
		while ( have_posts() ) :
			the_post();
			get_template_part( 'template-parts/components/product-card' );
		endwhile;
		?>
		<?php the_posts_pagination(); ?>
	<?php endif; ?>
</div>
<?php
get_footer();
