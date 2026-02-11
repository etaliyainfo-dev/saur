<?php
/**
 * Customizer settings.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

function meesho_ui_sanitize_checkbox( $checked ): bool {
	return (bool) $checked;
}

function meesho_ui_customize_register( WP_Customize_Manager $wp_customize ): void {
	$wp_customize->add_section( 'meesho_ui_brand', array( 'title' => esc_html__( 'MeeshoUI Brand', 'meesho-ui' ), 'priority' => 30 ) );

	$wp_customize->add_setting( 'meesho_ui_primary_color', array( 'default' => '#f43397', 'sanitize_callback' => 'sanitize_hex_color' ) );
	$wp_customize->add_setting( 'meesho_ui_accent_color', array( 'default' => '#2d2f36', 'sanitize_callback' => 'sanitize_hex_color' ) );
	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'meesho_ui_primary_color', array( 'section' => 'meesho_ui_brand', 'label' => esc_html__( 'Primary color', 'meesho-ui' ) ) ) );
	$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'meesho_ui_accent_color', array( 'section' => 'meesho_ui_brand', 'label' => esc_html__( 'Accent color', 'meesho-ui' ) ) ) );

	$wp_customize->add_section( 'meesho_ui_layout', array( 'title' => esc_html__( 'Layout', 'meesho-ui' ), 'priority' => 31 ) );
	$wp_customize->add_setting( 'meesho_ui_show_header_search', array( 'default' => true, 'sanitize_callback' => 'meesho_ui_sanitize_checkbox' ) );
	$wp_customize->add_setting( 'meesho_ui_bottom_nav_enabled', array( 'default' => true, 'sanitize_callback' => 'meesho_ui_sanitize_checkbox' ) );

	$wp_customize->add_control( 'meesho_ui_show_header_search', array( 'label' => esc_html__( 'Show header search', 'meesho-ui' ), 'section' => 'meesho_ui_layout', 'type' => 'checkbox' ) );
	$wp_customize->add_control( 'meesho_ui_bottom_nav_enabled', array( 'label' => esc_html__( 'Enable mobile bottom navigation', 'meesho-ui' ), 'section' => 'meesho_ui_layout', 'type' => 'checkbox' ) );

	$wp_customize->add_section( 'meesho_ui_home', array( 'title' => esc_html__( 'Homepage Sections', 'meesho-ui' ), 'priority' => 32 ) );
	$sections = array( 'hero', 'categories', 'trending', 'bestsellers', 'newarrivals', 'dealstrip', 'collections' );
	foreach ( $sections as $section ) {
		$key = 'meesho_ui_home_' . $section . '_enabled';
		$wp_customize->add_setting( $key, array( 'default' => true, 'sanitize_callback' => 'meesho_ui_sanitize_checkbox' ) );
		$wp_customize->add_control( $key, array( 'label' => sprintf( esc_html__( 'Enable %s', 'meesho-ui' ), ucfirst( $section ) ), 'section' => 'meesho_ui_home', 'type' => 'checkbox' ) );
	}

	$wp_customize->add_setting(
		'meesho_ui_home_sections_order',
		array(
			'default'           => 'hero,categories,trending,bestsellers,newarrivals,dealstrip,collections',
			'sanitize_callback' => static function ( $value ) {
				return sanitize_text_field( (string) $value );
			},
		)
	);
	$wp_customize->add_control( 'meesho_ui_home_sections_order', array( 'label' => esc_html__( 'Sections order (comma-separated)', 'meesho-ui' ), 'section' => 'meesho_ui_home', 'type' => 'text' ) );

	$wp_customize->add_section( 'meesho_ui_product_cards', array( 'title' => esc_html__( 'Product Cards', 'meesho-ui' ), 'priority' => 33 ) );
	$wp_customize->add_setting( 'meesho_ui_show_rating_placeholder', array( 'default' => true, 'sanitize_callback' => 'meesho_ui_sanitize_checkbox' ) );
	$wp_customize->add_setting( 'meesho_ui_show_badges', array( 'default' => true, 'sanitize_callback' => 'meesho_ui_sanitize_checkbox' ) );
	$wp_customize->add_control( 'meesho_ui_show_rating_placeholder', array( 'label' => esc_html__( 'Show rating placeholder', 'meesho-ui' ), 'section' => 'meesho_ui_product_cards', 'type' => 'checkbox' ) );
	$wp_customize->add_control( 'meesho_ui_show_badges', array( 'label' => esc_html__( 'Show sale and delivery badges', 'meesho-ui' ), 'section' => 'meesho_ui_product_cards', 'type' => 'checkbox' ) );

	$wp_customize->add_section( 'meesho_ui_footer', array( 'title' => esc_html__( 'Footer', 'meesho-ui' ), 'priority' => 34 ) );
	$wp_customize->add_setting( 'meesho_ui_footer_text', array( 'default' => esc_html__( '© MeeshoUI', 'meesho-ui' ), 'sanitize_callback' => 'sanitize_text_field' ) );
	$wp_customize->add_control( 'meesho_ui_footer_text', array( 'label' => esc_html__( 'Footer text', 'meesho-ui' ), 'section' => 'meesho_ui_footer', 'type' => 'text' ) );
}
add_action( 'customize_register', 'meesho_ui_customize_register' );

function meesho_ui_customizer_css(): void {
	$primary = sanitize_hex_color( (string) meesho_ui_get_option( 'meesho_ui_primary_color', '#f43397' ) );
	$accent  = sanitize_hex_color( (string) meesho_ui_get_option( 'meesho_ui_accent_color', '#2d2f36' ) );
	?>
	<style>
		:root{--meesho-primary:<?php echo esc_html( $primary ?: '#f43397' ); ?>;--meesho-accent:<?php echo esc_html( $accent ?: '#2d2f36' ); ?>}
	</style>
	<?php
}
add_action( 'wp_head', 'meesho_ui_customizer_css', 20 );
