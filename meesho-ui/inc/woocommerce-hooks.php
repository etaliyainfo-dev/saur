<?php
/**
 * WooCommerce integrations.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

if ( ! meesho_ui_is_woocommerce_active() ) {
	return;
}

function meesho_ui_woo_setup(): void {
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
	remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );
	add_filter( 'loop_shop_per_page', static fn() => 12 );
}
add_action( 'after_setup_theme', 'meesho_ui_woo_setup', 20 );

function meesho_ui_cart_count_fragment( array $fragments ): array {
	$fragments['.js-meesho-cart-count'] = '<span class="meesho-cart-count js-meesho-cart-count">' . absint( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ) . '</span>';
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'meesho_ui_cart_count_fragment' );

function meesho_ui_render_minicart_markup(): string {
	if ( ! WC()->cart ) {
		return '<p>' . esc_html__( 'Cart unavailable.', 'meesho-ui' ) . '</p>';
	}

	ob_start();
	if ( WC()->cart->is_empty() ) {
		echo '<p class="meesho-empty-state">' . esc_html__( 'Your cart is empty.', 'meesho-ui' ) . '</p>';
	} else {
		echo '<ul class="meesho-mini-cart-items">';
		foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			$product = isset( $cart_item['data'] ) && $cart_item['data'] instanceof WC_Product ? $cart_item['data'] : null;
			if ( ! $product || ! $product->exists() ) {
				continue;
			}
			echo '<li>';
			echo '<span>' . esc_html( $product->get_name() ) . '</span>';
			echo '<div class="meesho-mini-cart-qty">';
			echo '<button class="js-minicart-qty" data-cart-item-key="' . esc_attr( $cart_item_key ) . '" data-qty="' . absint( max( 0, $cart_item['quantity'] - 1 ) ) . '" aria-label="' . esc_attr__( 'Decrease quantity', 'meesho-ui' ) . '">-</button>';
			echo '<span>' . absint( $cart_item['quantity'] ) . '</span>';
			echo '<button class="js-minicart-qty" data-cart-item-key="' . esc_attr( $cart_item_key ) . '" data-qty="' . absint( $cart_item['quantity'] + 1 ) . '" aria-label="' . esc_attr__( 'Increase quantity', 'meesho-ui' ) . '">+</button>';
			echo '</div>';
			echo '<span>' . wp_kses_post( WC()->cart->get_product_price( $product ) ) . '</span>';
			echo '</li>';
		}
		echo '</ul>';
		echo '<p class="meesho-mini-cart-subtotal"><strong>' . esc_html__( 'Subtotal:', 'meesho-ui' ) . '</strong> ' . wp_kses_post( WC()->cart->get_cart_subtotal() ) . '</p>';
	}
	return (string) ob_get_clean();
}

function meesho_ui_product_loop_card_open(): void {
	echo '<div class="meesho-product-card">';
}
add_action( 'woocommerce_before_shop_loop_item', 'meesho_ui_product_loop_card_open', 5 );

function meesho_ui_product_loop_card_close(): void {
	echo '</div>';
}
add_action( 'woocommerce_after_shop_loop_item', 'meesho_ui_product_loop_card_close', 30 );

function meesho_ui_single_product_meta_blocks(): void {
	echo '<section class="meesho-info-block" aria-label="' . esc_attr__( 'Delivery and returns information', 'meesho-ui' ) . '">';
	echo '<p><strong>' . esc_html__( 'Delivery', 'meesho-ui' ) . ':</strong> ' . esc_html__( 'Dispatch in 24 hours. Free shipping above ₹499.', 'meesho-ui' ) . '</p>';
	echo '<p><strong>' . esc_html__( 'Returns', 'meesho-ui' ) . ':</strong> ' . esc_html__( 'Easy 7 day returns for eligible products.', 'meesho-ui' ) . '</p>';
	echo '<p><strong>' . esc_html__( 'Store', 'meesho-ui' ) . ':</strong> ' . esc_html( get_bloginfo( 'name' ) ) . '</p>';
	echo '</section>';
}
add_action( 'woocommerce_single_product_summary', 'meesho_ui_single_product_meta_blocks', 25 );

function meesho_ui_mobile_single_bar(): void {
	global $product;
	if ( ! $product instanceof WC_Product ) {
		return;
	}
	echo '<div class="meesho-mobile-product-bar" role="region" aria-label="' . esc_attr__( 'Quick purchase actions', 'meesho-ui' ) . '">';
	echo '<button class="button button-secondary js-wishlist-toggle" data-product-id="' . absint( $product->get_id() ) . '">' . esc_html__( 'Wishlist', 'meesho-ui' ) . '</button>';
	woocommerce_template_single_add_to_cart();
	echo '</div>';
}
add_action( 'woocommerce_after_single_product_summary', 'meesho_ui_mobile_single_bar', 5 );

function meesho_ui_ajax_update_mini_cart_qty(): void {
	check_ajax_referer( 'meesho_ui_ajax', 'nonce' );
	$cart_item_key = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( wp_unslash( $_POST['cart_item_key'] ) ) : '';
	$quantity      = isset( $_POST['quantity'] ) ? max( 0, absint( wp_unslash( $_POST['quantity'] ) ) ) : 1;

	if ( ! WC()->cart || ! $cart_item_key ) {
		wp_send_json_error( array( 'message' => esc_html__( 'Invalid cart item.', 'meesho-ui' ) ) );
	}

	if ( 0 === $quantity ) {
		WC()->cart->remove_cart_item( $cart_item_key );
	} else {
		WC()->cart->set_quantity( $cart_item_key, $quantity, true );
	}

	wp_send_json_success(
		array(
			'mini_cart' => meesho_ui_render_minicart_markup(),
			'count'     => WC()->cart->get_cart_contents_count(),
			'subtotal'  => WC()->cart->get_cart_subtotal(),
		)
	);
}
add_action( 'wp_ajax_meesho_ui_update_cart_qty', 'meesho_ui_ajax_update_mini_cart_qty' );
add_action( 'wp_ajax_nopriv_meesho_ui_update_cart_qty', 'meesho_ui_ajax_update_mini_cart_qty' );
