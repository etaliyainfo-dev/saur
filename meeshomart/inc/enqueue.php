<?php
/**
 * Enqueue scripts and styles.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Build file version from filemtime.
 *
 * @param string $relative_file Relative path from theme root.
 * @return string
 */
function meeshomart_asset_version( string $relative_file ): string {
	$path = get_template_directory() . '/' . ltrim( $relative_file, '/' );
	return file_exists( $path ) ? (string) filemtime( $path ) : wp_get_theme()->get( 'Version' );
}

/**
 * Enqueue frontend assets.
 */
function meeshomart_enqueue_assets(): void {
	wp_enqueue_style( 'meeshomart-style', get_stylesheet_uri(), array(), meeshomart_asset_version( 'style.css' ) );
	wp_enqueue_style( 'meeshomart-main', get_template_directory_uri() . '/assets/css/main.css', array( 'meeshomart-style' ), meeshomart_asset_version( 'assets/css/main.css' ) );

	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_style( 'meeshomart-woocommerce', get_template_directory_uri() . '/assets/css/woocommerce.css', array( 'meeshomart-main' ), meeshomart_asset_version( 'assets/css/woocommerce.css' ) );
	}

	wp_enqueue_script( 'meeshomart-main', get_template_directory_uri() . '/assets/js/main.js', array(), meeshomart_asset_version( 'assets/js/main.js' ), true );
	wp_script_add_data( 'meeshomart-main', 'defer', true );

	wp_enqueue_script( 'meeshomart-ajax-search', get_template_directory_uri() . '/assets/js/ajax-search.js', array(), meeshomart_asset_version( 'assets/js/ajax-search.js' ), true );
	wp_script_add_data( 'meeshomart-ajax-search', 'defer', true );

	wp_localize_script(
		'meeshomart-ajax-search',
		'MeeshoMartData',
		array(
			'ajaxurl'      => admin_url( 'admin-ajax.php' ),
			'nonce'        => wp_create_nonce( 'meeshomart_search_nonce' ),
			'minChars'     => 2,
			'noResults'    => esc_html__( 'No products found.', 'meeshomart' ),
			'viewAllLabel' => esc_html__( 'View all results', 'meeshomart' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'meeshomart_enqueue_assets' );

/**
 * Add customizer CSS variables.
 */
function meeshomart_inline_customizer_css(): void {
	$primary = sanitize_hex_color( meeshomart_get_setting( 'meeshomart_primary_color', '#5b3df5' ) );
	$accent  = sanitize_hex_color( meeshomart_get_setting( 'meeshomart_accent_color', '#ff4d6d' ) );

	$css  = ':root{';
	$css .= '--mm-color-primary:' . ( $primary ? $primary : '#5b3df5' ) . ';';
	$css .= '--mm-color-accent:' . ( $accent ? $accent : '#ff4d6d' ) . ';';
	$css .= '}';

	wp_add_inline_style( 'meeshomart-main', $css );
}
add_action( 'wp_enqueue_scripts', 'meeshomart_inline_customizer_css', 20 );
