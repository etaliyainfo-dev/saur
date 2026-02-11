<?php
/**
 * Sidebar.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>
<aside id="secondary" class="widget-area" aria-label="<?php esc_attr_e( 'Sidebar', 'meeshomart' ); ?>">
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside>
