<?php
defined( 'ABSPATH' ) || exit;
final class CFP_Plugin {
	private static ?CFP_Plugin $instance = null;
	public static function instance(): CFP_Plugin { return self::$instance ??= new self(); }
	public function init(): void {
		load_plugin_textdomain( 'conversionflow-pro', false, dirname( CFP_BASENAME ) . '/languages' );
		if ( ! $this->dependencies_ready() ) { add_action( 'admin_notices', array( $this, 'dependency_notice' ) ); return; }
		(new CFP_Router())->hooks(); (new CFP_Tracking())->hooks(); (new CFP_Frontend())->hooks(); (new CFP_Admin())->hooks(); (new CFP_REST_API())->hooks(); (new CFP_Checkout())->hooks(); (new CFP_Order_Bump())->hooks(); (new CFP_Upsell())->hooks(); (new CFP_Download_Handler())->hooks(); (new CFP_Automation_Cron())->hooks(); (new CFP_Elementor())->hooks();
	}
	private function dependencies_ready(): bool { return class_exists( 'WooCommerce' ) && did_action( 'elementor/loaded' ); }
	public function dependency_notice(): void { echo '<div class="notice notice-error"><p>' . esc_html__( 'ConversionFlow Pro requires WooCommerce and Elementor to be active.', 'conversionflow-pro' ) . '</p></div>'; }
}
