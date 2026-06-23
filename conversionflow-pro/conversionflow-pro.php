<?php
/**
 * Plugin Name: ConversionFlow Pro
 * Description: Elementor-first WooCommerce funnel builder with checkout, order bumps, upsells, automations, email, file delivery, analytics, and integrations.
 * Version: 1.0.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Author: ConversionFlow
 * Text Domain: conversionflow-pro
 * Domain Path: /languages
 * WC requires at least: 8.0
 * WC tested up to: 9.9
 */

defined( 'ABSPATH' ) || exit;

define( 'CFP_VERSION', '1.0.0' );
define( 'CFP_FILE', __FILE__ );
define( 'CFP_PATH', plugin_dir_path( __FILE__ ) );
define( 'CFP_URL', plugin_dir_url( __FILE__ ) );
define( 'CFP_BASENAME', plugin_basename( __FILE__ ) );

spl_autoload_register(
	static function ( string $class ): void {
		if ( 0 !== strpos( $class, 'CFP_' ) ) {
			return;
		}
		$map = array(
			'CFP_Plugin' => 'includes/class-plugin.php', 'CFP_Activator' => 'includes/class-activator.php', 'CFP_Deactivator' => 'includes/class-deactivator.php', 'CFP_Database' => 'includes/class-database.php', 'CFP_REST_API' => 'includes/class-rest-api.php', 'CFP_Security' => 'includes/class-security.php', 'CFP_Logger' => 'includes/class-logger.php',
			'CFP_Admin' => 'admin/class-admin.php', 'CFP_Frontend' => 'frontend/class-frontend.php', 'CFP_Router' => 'frontend/class-router.php', 'CFP_Tracking' => 'frontend/class-tracking.php',
			'CFP_Funnels' => 'funnels/class-funnels.php', 'CFP_Steps' => 'funnels/class-steps.php', 'CFP_Templates' => 'funnels/class-templates.php',
			'CFP_Checkout' => 'checkout/class-checkout.php', 'CFP_Fields' => 'checkout/class-fields.php', 'CFP_Order_Bump' => 'checkout/class-order-bump.php',
			'CFP_Upsell' => 'upsells/class-upsell.php', 'CFP_Downsell' => 'upsells/class-downsell.php',
			'CFP_Automation_Engine' => 'automations/class-automation-engine.php', 'CFP_Automation_Rules' => 'automations/class-automation-rules.php', 'CFP_Automation_Actions' => 'automations/class-automation-actions.php', 'CFP_Automation_Cron' => 'automations/class-automation-cron.php',
			'CFP_Email_Engine' => 'emails/class-email-engine.php', 'CFP_Email_Templates' => 'emails/class-email-templates.php', 'CFP_Email_Logger' => 'emails/class-email-logger.php',
			'CFP_File_Manager' => 'files/class-file-manager.php', 'CFP_Download_Handler' => 'files/class-download-handler.php', 'CFP_File_Access' => 'files/class-file-access.php',
			'CFP_Webhooks' => 'webhooks/class-webhooks.php', 'CFP_Webhook_Logger' => 'webhooks/class-webhook-logger.php',
			'CFP_Analytics' => 'analytics/class-analytics.php', 'CFP_Reports' => 'analytics/class-reports.php',
			'CFP_Elementor' => 'integrations/class-elementor.php', 'CFP_Elementor_Widget' => 'integrations/widgets/class-elementor-widget.php',
		);
		if ( isset( $map[ $class ] ) ) {
			require_once CFP_PATH . $map[ $class ];
		}
	}
);

register_activation_hook( __FILE__, array( 'CFP_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'CFP_Deactivator', 'deactivate' ) );
add_action( 'before_woocommerce_init', static function (): void { if ( class_exists( '\Automattic\WooCommerce\Utilities\FeaturesUtil' ) ) { \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true ); } } );
add_action( 'plugins_loaded', static function (): void { CFP_Plugin::instance()->init(); } );
