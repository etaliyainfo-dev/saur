<?php
/**
 * MeeshoMart theme functions.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

$meeshomart_includes = array(
	'/inc/helpers.php',
	'/inc/setup.php',
	'/inc/enqueue.php',
	'/inc/customizer.php',
	'/inc/breadcrumbs.php',
	'/inc/ajax-search.php',
	'/inc/woocommerce.php',
);

foreach ( $meeshomart_includes as $meeshomart_file ) {
	$meeshomart_path = get_template_directory() . $meeshomart_file;
	if ( file_exists( $meeshomart_path ) ) {
		require_once $meeshomart_path;
	}
}
