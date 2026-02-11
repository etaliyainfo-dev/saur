<?php
/**
 * Template Name: Landing Page
 * Template Post Type: page
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'mm-landing-page' ); ?>>
<?php wp_body_open(); ?>
<main id="primary" class="mm-landing-main">
	<?php
	while ( have_posts() ) :
		the_post();
		the_content();
	endwhile;
	?>
</main>
<?php wp_footer(); ?>
</body>
</html>
