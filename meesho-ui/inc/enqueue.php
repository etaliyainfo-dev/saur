<?php
/**
 * Enqueue scripts and styles.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

function meesho_ui_enqueue_assets(): void {
	$version = wp_get_theme()->get( 'Version' );

	wp_enqueue_style( 'meesho-ui-main', get_template_directory_uri() . '/assets/css/main.css', array(), $version );
	wp_enqueue_style( 'meesho-ui-components', get_template_directory_uri() . '/assets/css/components.css', array( 'meesho-ui-main' ), $version );

	if ( meesho_ui_is_woocommerce_active() ) {
		wp_enqueue_style( 'meesho-ui-woo', get_template_directory_uri() . '/assets/css/woocommerce.css', array( 'meesho-ui-main' ), $version );
	}

	$deps = array();
	wp_enqueue_script( 'meesho-ui-main', get_template_directory_uri() . '/assets/js/main.js', $deps, $version, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'meesho-ui-toast', get_template_directory_uri() . '/assets/js/toast.js', array(), $version, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'meesho-ui-filters', get_template_directory_uri() . '/assets/js/filters.js', array(), $version, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'meesho-ui-search', get_template_directory_uri() . '/assets/js/search-suggest.js', array(), $version, array( 'strategy' => 'defer', 'in_footer' => true ) );
	wp_enqueue_script( 'meesho-ui-minicart', get_template_directory_uri() . '/assets/js/minicart.js', array(), $version, array( 'strategy' => 'defer', 'in_footer' => true ) );

	wp_localize_script(
		'meesho-ui-main',
		'MeeshoUI',
		array(
			'ajaxUrl'       => esc_url_raw( admin_url( 'admin-ajax.php' ) ),
			'nonce'         => wp_create_nonce( 'meesho_ui_ajax' ),
			'searchNonce'   => wp_create_nonce( 'meesho_ui_search' ),
			'isWoo'         => meesho_ui_is_woocommerce_active(),
			'cartUrl'       => meesho_ui_is_woocommerce_active() ? esc_url_raw( wc_get_cart_url() ) : '',
			'checkoutUrl'   => meesho_ui_is_woocommerce_active() ? esc_url_raw( wc_get_checkout_url() ) : '',
			'currency'      => function_exists( 'get_woocommerce_currency_symbol' ) ? get_woocommerce_currency_symbol() : '',
		)
	);
}
add_action( 'wp_enqueue_scripts', 'meesho_ui_enqueue_assets' );

function meesho_ui_search_suggestions_ajax(): void {
	check_ajax_referer( 'meesho_ui_search', 'nonce' );
	$query = isset( $_GET['query'] ) ? sanitize_text_field( wp_unslash( $_GET['query'] ) ) : '';
	if ( mb_strlen( $query ) < 2 ) {
		wp_send_json_success( array() );
	}

	$cache_key = 'meesho_ui_suggest_' . md5( $query );
	$cached    = get_transient( $cache_key );
	if ( false !== $cached ) {
		wp_send_json_success( $cached );
	}

	if ( ! function_exists( 'wc_get_product' ) ) {
		wp_send_json_success( array() );
	}

	$products = new WP_Query(
		array(
			'post_type'      => 'product',
			'post_status'    => 'publish',
			's'              => $query,
			'posts_per_page' => 8,
		)
	);

	$results = array();
	if ( $products->have_posts() ) {
		while ( $products->have_posts() ) {
			$products->the_post();
			$product = wc_get_product( get_the_ID() );
			if ( ! $product ) {
				continue;
			}
			$results[] = array(
				'title'      => get_the_title(),
				'permalink'  => get_permalink(),
				'price_html' => wp_kses_post( $product->get_price_html() ),
				'thumb_url'  => get_the_post_thumbnail_url( get_the_ID(), 'thumbnail' ),
			);
		}
		wp_reset_postdata();
	}
	set_transient( $cache_key, $results, 5 * MINUTE_IN_SECONDS );
	wp_send_json_success( $results );
}
add_action( 'wp_ajax_meesho_ui_search', 'meesho_ui_search_suggestions_ajax' );
add_action( 'wp_ajax_nopriv_meesho_ui_search', 'meesho_ui_search_suggestions_ajax' );
