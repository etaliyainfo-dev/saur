<?php
/**
 * Theme bootstrap file.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

$meesho_ui_includes = array(
	'/inc/helpers.php',
	'/inc/setup.php',
	'/inc/enqueue.php',
	'/inc/customizer.php',
	'/inc/breadcrumbs.php',
	'/inc/woocommerce-hooks.php',
);

foreach ( $meesho_ui_includes as $meesho_ui_include ) {
	$meesho_ui_file = get_template_directory() . $meesho_ui_include;
	if ( file_exists( $meesho_ui_file ) ) {
		require_once $meesho_ui_file;
	}
}
