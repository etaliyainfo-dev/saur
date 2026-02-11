<?php
/**
 * Main index.
 *
 * @package MeeshoUI
 */

get_header();
if ( have_posts() ) :
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/content', get_post_type() );
	endwhile;
	the_posts_pagination();
else :
	echo '<p>' . esc_html__( 'No content found.', 'meesho-ui' ) . '</p>';
endif;
get_footer();
