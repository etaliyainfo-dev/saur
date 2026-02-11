<?php
/**
 * Site footer.
 *
 * @package MeeshoUI
 */
?>
<footer class="meesho-footer" role="contentinfo">
	<div class="meesho-footer__inner">
		<?php if ( has_nav_menu( 'footer' ) ) : ?>
			<?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'menu_class' => 'meesho-footer-menu' ) ); ?>
		<?php endif; ?>
		<p><?php echo esc_html( (string) meesho_ui_get_option( 'meesho_ui_footer_text', __( '© MeeshoUI', 'meesho-ui' ) ) ); ?></p>
	</div>
</footer>
