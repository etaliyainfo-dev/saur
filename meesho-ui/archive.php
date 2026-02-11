<?php
get_header();
if ( have_posts() ) :
	the_archive_title( '<h1>', '</h1>' );
	while ( have_posts() ) :
		the_post();
		get_template_part( 'template-parts/content', get_post_type() );
	endwhile;
	the_posts_pagination();
endif;
get_footer();
