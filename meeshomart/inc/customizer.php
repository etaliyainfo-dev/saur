<?php
/**
 * Theme customizer settings.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register customizer fields.
 *
 * @param WP_Customize_Manager $wp_customize Customizer object.
 */
function meeshomart_customize_register( WP_Customize_Manager $wp_customize ): void {
	$wp_customize->add_section(
		'meeshomart_colors',
		array(
			'title'    => esc_html__( 'MeeshoMart Colors', 'meeshomart' ),
			'priority' => 30,
		)
	);

	$wp_customize->add_setting(
		'meeshomart_primary_color',
		array(
			'default'           => '#5b3df5',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'         => 'postMessage',
		)
	);

	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'meeshomart_primary_color',
			array(
				'label'   => esc_html__( 'Primary Color', 'meeshomart' ),
				'section' => 'meeshomart_colors',
			)
		)
	);

	$wp_customize->add_setting(
		'meeshomart_accent_color',
		array(
			'default'           => '#ff4d6d',
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'         => 'postMessage',
		)
	);

	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'meeshomart_accent_color',
			array(
				'label'   => esc_html__( 'Accent Color', 'meeshomart' ),
				'section' => 'meeshomart_colors',
			)
		)
	);

	$wp_customize->add_section(
		'meeshomart_header',
		array(
			'title'    => esc_html__( 'Header Options', 'meeshomart' ),
			'priority' => 31,
		)
	);

	$wp_customize->add_setting(
		'meeshomart_show_header_search',
		array(
			'default'           => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
			'transport'         => 'postMessage',
		)
	);

	$wp_customize->add_control(
		'meeshomart_show_header_search',
		array(
			'type'    => 'checkbox',
			'label'   => esc_html__( 'Show header search bar', 'meeshomart' ),
			'section' => 'meeshomart_header',
		)
	);

	$wp_customize->add_section(
		'meeshomart_homepage',
		array(
			'title'    => esc_html__( 'Homepage Sections', 'meeshomart' ),
			'priority' => 32,
		)
	);

	foreach (
		array(
			'meeshomart_show_category_grid'      => esc_html__( 'Show category grid', 'meeshomart' ),
			'meeshomart_show_featured_products'  => esc_html__( 'Show featured products section', 'meeshomart' ),
		) as $key => $label
	) {
		$wp_customize->add_setting(
			$key,
			array(
				'default'           => true,
				'sanitize_callback' => 'rest_sanitize_boolean',
				'transport'         => 'postMessage',
			)
		);
		$wp_customize->add_control(
			$key,
			array(
				'type'    => 'checkbox',
				'label'   => $label,
				'section' => 'meeshomart_homepage',
			)
		);
	}

	$wp_customize->add_section(
		'meeshomart_footer',
		array(
			'title'    => esc_html__( 'Footer', 'meeshomart' ),
			'priority' => 33,
		)
	);

	$wp_customize->add_setting(
		'meeshomart_footer_copyright',
		array(
			'default'           => esc_html__( '© MeeshoMart. All rights reserved.', 'meeshomart' ),
			'sanitize_callback' => 'sanitize_text_field',
		)
	);

	$wp_customize->add_control(
		'meeshomart_footer_copyright',
		array(
			'type'    => 'text',
			'label'   => esc_html__( 'Copyright Text', 'meeshomart' ),
			'section' => 'meeshomart_footer',
		)
	);
}
add_action( 'customize_register', 'meeshomart_customize_register' );
