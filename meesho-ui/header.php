<?php
/**
 * Header template.
 *
 * @package MeeshoUI
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'meesho-ui' ); ?></a>
<?php get_template_part( 'template-parts/header/site', 'header' ); ?>
<main id="content" class="site-content">
<?php meesho_ui_breadcrumbs(); ?>
