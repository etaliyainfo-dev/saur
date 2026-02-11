<?php
/**
 * Filter drawer.
 *
 * @package MeeshoUI
 */
?>
<div class="meesho-drawer" id="meesho-filter-drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="meesho-filter-title">
	<div class="meesho-drawer__overlay js-close-drawer" data-target="meesho-filter-drawer"></div>
	<aside class="meesho-drawer__panel">
		<header>
			<h2 id="meesho-filter-title"><?php esc_html_e( 'Filters', 'meesho-ui' ); ?></h2>
			<button type="button" class="js-close-drawer" data-target="meesho-filter-drawer" aria-label="<?php esc_attr_e( 'Close filters', 'meesho-ui' ); ?>">×</button>
		</header>
		<?php if ( is_active_sidebar( 'shop-filters' ) ) : ?>
			<?php dynamic_sidebar( 'shop-filters' ); ?>
		<?php else : ?>
			<p><?php esc_html_e( 'Add filter widgets to “Shop Filters” sidebar.', 'meesho-ui' ); ?></p>
		<?php endif; ?>
	</aside>
</div>
