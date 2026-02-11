<?php
/**
 * Site footer.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;
$copyright = meeshomart_get_setting( 'meeshomart_footer_copyright', esc_html__( '© MeeshoMart. All rights reserved.', 'meeshomart' ) );
?>
<footer class="site-footer" role="contentinfo">
	<div class="mm-container mm-footer-grid">
		<div><?php dynamic_sidebar( 'footer-1' ); ?></div>
		<div><?php dynamic_sidebar( 'footer-2' ); ?></div>
	</div>
	<nav class="mm-footer-menu" aria-label="<?php esc_attr_e( 'Footer', 'meeshomart' ); ?>">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'footer',
				'menu_class'     => 'mm-footer-links',
				'container'      => false,
				'fallback_cb'    => false,
			)
		);
		?>
	</nav>
	<div class="mm-copyright"><?php echo esc_html( $copyright ); ?></div>
</footer>
