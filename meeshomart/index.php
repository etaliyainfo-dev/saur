<?php
/**
 * Main index template.
 *
 * @package MeeshoMart
 */

get_header();
?>
<div class="mm-container">
	<?php if ( have_posts() ) : ?>
		<div class="mm-post-grid">
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'mm-post-card' ); ?>>
					<?php if ( has_post_thumbnail() ) : ?>
						<a href="<?php the_permalink(); ?>" class="mm-post-thumb"><?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?></a>
					<?php endif; ?>
					<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					<div class="entry-summary"><?php the_excerpt(); ?></div>
				</article>
				<?php
			endwhile;
			?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?>
		<p><?php esc_html_e( 'No content found.', 'meeshomart' ); ?></p>
	<?php endif; ?>
</div>
<?php
get_footer();
