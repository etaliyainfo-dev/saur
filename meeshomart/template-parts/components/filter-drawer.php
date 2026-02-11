<?php
/**
 * Mobile filter drawer.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;
?>
<aside class="mm-filter-drawer" aria-hidden="true" data-mm-filter-drawer>
	<div class="mm-filter-overlay" data-mm-close-filters></div>
	<div class="mm-filter-panel" role="dialog" aria-modal="true" aria-label="<?php esc_attr_e( 'Filter products', 'meeshomart' ); ?>">
		<div class="mm-filter-head">
			<h2><?php esc_html_e( 'Filters', 'meeshomart' ); ?></h2>
			<button type="button" data-mm-close-filters><?php echo wp_kses_post( meeshomart_svg_icon( 'close' ) ); ?><span class="screen-reader-text"><?php esc_html_e( 'Close filters', 'meeshomart' ); ?></span></button>
		</div>
		<?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
			<?php dynamic_sidebar( 'sidebar-1' ); ?>
		<?php else : ?>
			<p><?php esc_html_e( 'Add WooCommerce filter widgets to Sidebar.', 'meeshomart' ); ?></p>
		<?php endif; ?>
	</div>
</aside>
