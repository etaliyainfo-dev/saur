<?php
/**
 * Theme setup.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Setup theme defaults.
 */
function meeshomart_setup(): void {
	load_theme_textdomain( 'meeshomart', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 240,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/main.css' );

	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary Menu', 'meeshomart' ),
			'footer'  => esc_html__( 'Footer Menu', 'meeshomart' ),
		)
	);
}
add_action( 'after_setup_theme', 'meeshomart_setup' );

/**
 * Register widget areas.
 */
function meeshomart_widgets_init(): void {
	$widgets = array(
		'sidebar-1' => esc_html__( 'Sidebar', 'meeshomart' ),
		'footer-1'  => esc_html__( 'Footer 1', 'meeshomart' ),
		'footer-2'  => esc_html__( 'Footer 2', 'meeshomart' ),
	);

	foreach ( $widgets as $id => $name ) {
		register_sidebar(
			array(
				'name'          => $name,
				'id'            => $id,
				'before_widget' => '<section id="%1$s" class="widget %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
	}
}
add_action( 'widgets_init', 'meeshomart_widgets_init' );

/**
 * Content width.
 */
function meeshomart_content_width(): void {
	$GLOBALS['content_width'] = apply_filters( 'meeshomart_content_width', 1200 );
}
add_action( 'after_setup_theme', 'meeshomart_content_width', 0 );
