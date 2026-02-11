<?php
/**
 * 404 template.
 *
 * @package MeeshoMart
 */

get_header();
?>
<div class="mm-container mm-empty-state">
	<h1><?php esc_html_e( 'Page not found', 'meeshomart' ); ?></h1>
	<p><?php esc_html_e( 'Sorry, we could not find what you are looking for.', 'meeshomart' ); ?></p>
	<a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to Home', 'meeshomart' ); ?></a>
</div>
<?php
get_footer();
