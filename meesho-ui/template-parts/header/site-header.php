<?php
/**
 * Site header.
 *
 * @package MeeshoUI
 */
?>
<header class="meesho-header" role="banner">
	<div class="meesho-header__inner">
		<div class="meesho-logo-wrap">
			<?php
			if ( has_custom_logo() ) {
				the_custom_logo();
			} else {
				echo '<a class="meesho-logo" href="' . esc_url( home_url( '/' ) ) . '">' . esc_html( get_bloginfo( 'name' ) ) . '</a>';
			}
			?>
		</div>
		<?php if ( meesho_ui_get_option( 'meesho_ui_show_header_search', true ) ) : ?>
		<form role="search" class="meesho-search js-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>" method="get">
			<label class="screen-reader-text" for="meesho-search-input"><?php esc_html_e( 'Search products', 'meesho-ui' ); ?></label>
			<input id="meesho-search-input" class="js-search-input" type="search" name="s" placeholder="<?php esc_attr_e( 'Search products, categories…', 'meesho-ui' ); ?>" autocomplete="off" />
			<input type="hidden" name="post_type" value="product" />
			<div class="meesho-search-suggestions js-search-suggestions" hidden></div>
		</form>
		<?php endif; ?>
		<?php if ( meesho_ui_is_woocommerce_active() ) : ?>
		<a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="meesho-cart-button js-open-minicart" aria-expanded="false" aria-controls="meesho-minicart-drawer">
			<span aria-hidden="true">🛒</span>
			<span class="screen-reader-text"><?php esc_html_e( 'Open cart drawer', 'meesho-ui' ); ?></span>
			<span class="meesho-cart-count js-meesho-cart-count"><?php echo absint( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?></span>
		</a>
		<?php endif; ?>
	</div>
</header>
