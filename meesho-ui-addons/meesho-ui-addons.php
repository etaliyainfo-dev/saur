<?php
/**
 * Plugin Name: MeeshoUI Addons
 * Description: Companion plugin for MeeshoUI theme wishlist and cart UX enhancements.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: MeeshoUI Team
 * Text Domain: meesho-ui-addons
 */

defined( 'ABSPATH' ) || exit;

define( 'MEESHO_UI_ADDONS_VERSION', '1.0.0' );
define( 'MEESHO_UI_ADDONS_FILE', __FILE__ );
define( 'MEESHO_UI_ADDONS_PATH', plugin_dir_path( __FILE__ ) );
define( 'MEESHO_UI_ADDONS_URL', plugin_dir_url( __FILE__ ) );

require_once MEESHO_UI_ADDONS_PATH . 'includes/helpers.php';
require_once MEESHO_UI_ADDONS_PATH . 'includes/class-wishlist.php';
require_once MEESHO_UI_ADDONS_PATH . 'includes/class-ajax.php';

function meesho_ui_addons_init(): void {
	Meesho_UI_Addons_Wishlist::instance();
	Meesho_UI_Addons_Ajax::instance();
}
add_action( 'plugins_loaded', 'meesho_ui_addons_init' );
