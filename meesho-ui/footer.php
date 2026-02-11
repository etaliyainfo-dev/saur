<?php
/**
 * Footer template.
 *
 * @package MeeshoUI
 */
?>
</main>
<?php
get_template_part( 'template-parts/footer/site', 'footer' );
get_template_part( 'template-parts/components/minicart', 'drawer' );
get_template_part( 'template-parts/components/filter', 'drawer' );
get_template_part( 'template-parts/components/toast' );
if ( meesho_ui_get_option( 'meesho_ui_bottom_nav_enabled', true ) ) {
	get_template_part( 'template-parts/components/mobile-bottom-nav' );
}
wp_footer();
?>
</body>
</html>
