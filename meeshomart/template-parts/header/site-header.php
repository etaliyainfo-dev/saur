<?php
/**
 * Site header.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;
$show_search = (bool) meeshomart_get_setting( 'meeshomart_show_header_search', true );
?>
<header class="site-header" role="banner">
	<div class="mm-container mm-header-inner">
		<div class="mm-logo-wrap">
			<button class="mm-nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" data-mm-toggle="menu">
				<span class="screen-reader-text"><?php esc_html_e( 'Toggle menu', 'meeshomart' ); ?></span>
				<?php echo wp_kses_post( meeshomart_svg_icon( 'menu' ) ); ?>
			</button>
			<?php
			if ( has_custom_logo() ) {
				the_custom_logo();
			} else {
				?>
				<a class="site-title" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
				<?php
			}
			?>
		</div>
		<?php if ( $show_search ) : ?>
			<form class="mm-header-search" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
				<label for="mm-search-input" class="screen-reader-text"><?php esc_html_e( 'Search products', 'meeshomart' ); ?></label>
				<input id="mm-search-input" type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search products, categories...', 'meeshomart' ); ?>" autocomplete="off" data-mm-search-input>
				<input type="hidden" name="post_type" value="product">
				<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'meeshomart' ); ?>"><?php echo wp_kses_post( meeshomart_svg_icon( 'search' ) ); ?></button>
				<div class="mm-search-suggestions" data-mm-search-results aria-live="polite"></div>
			</form>
		<?php endif; ?>
		<a class="mm-header-cart" href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Cart', 'meeshomart' ); ?>" data-mm-open-cart>
			<?php echo wp_kses_post( meeshomart_svg_icon( 'cart' ) ); ?>
			<span class="mm-cart-count"><?php echo esc_html( class_exists( 'WooCommerce' ) && WC()->cart ? (string) WC()->cart->get_cart_contents_count() : '0' ); ?></span>
		</a>
	</div>
	<nav class="mm-primary-nav" id="primary-menu" aria-label="<?php esc_attr_e( 'Primary', 'meeshomart' ); ?>">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'menu_class'     => 'mm-menu',
				'container'      => false,
				'fallback_cb'    => false,
			)
		);
		?>
	</nav>
</header>
