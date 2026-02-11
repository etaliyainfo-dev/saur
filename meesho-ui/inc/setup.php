<?php
/**
 * Theme setup.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

function meesho_ui_setup(): void {
	load_theme_textdomain( 'meesho-ui', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'custom-logo', array( 'height' => 48, 'width' => 180, 'flex-width' => true ) );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'gallery', 'caption', 'script', 'style' ) );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );

	if ( meesho_ui_is_woocommerce_active() ) {
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-slider' );
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
	}

	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary Menu', 'meesho-ui' ),
			'footer'  => esc_html__( 'Footer Menu', 'meesho-ui' ),
		)
	);
}
add_action( 'after_setup_theme', 'meesho_ui_setup' );

function meesho_ui_content_width(): void {
	$GLOBALS['content_width'] = 1200;
}
add_action( 'after_setup_theme', 'meesho_ui_content_width', 0 );

function meesho_ui_body_classes( array $classes ): array {
	if ( meesho_ui_is_woocommerce_active() ) {
		$classes[] = 'meesho-ui-has-woo';
	}
	return $classes;
}
add_filter( 'body_class', 'meesho_ui_body_classes' );

function meesho_ui_widgets_init(): void {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Shop Filters', 'meesho-ui' ),
			'id'            => 'shop-filters',
			'before_widget' => '<section class="widget %2$s" id="%1$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'meesho_ui_widgets_init' );
