<?php
/**
 * Breadcrumb helpers.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'meeshomart_breadcrumbs' ) ) {
	/**
	 * Render simple breadcrumbs.
	 */
	function meeshomart_breadcrumbs(): void {
		if ( is_front_page() ) {
			return;
		}

		echo '<nav class="mm-breadcrumbs" aria-label="' . esc_attr__( 'Breadcrumb', 'meeshomart' ) . '">';
		echo '<a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'meeshomart' ) . '</a>';
		echo '<span aria-hidden="true">' . wp_kses_post( meeshomart_svg_icon( 'chevron-r' ) ) . '</span>';

		if ( function_exists( 'is_woocommerce' ) && is_woocommerce() ) {
			if ( is_shop() ) {
				echo '<span>' . esc_html( woocommerce_page_title( false ) ) . '</span>';
			} elseif ( is_product_category() || is_product_tag() ) {
				$term = get_queried_object();
				if ( $term instanceof WP_Term ) {
					echo '<span>' . esc_html( $term->name ) . '</span>';
				}
			} elseif ( is_product() ) {
				echo '<a href="' . esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ) . '">' . esc_html__( 'Shop', 'meeshomart' ) . '</a>';
				echo '<span aria-hidden="true">' . wp_kses_post( meeshomart_svg_icon( 'chevron-r' ) ) . '</span>';
				echo '<span>' . esc_html( get_the_title() ) . '</span>';
			}
		} elseif ( is_singular() ) {
			echo '<span>' . esc_html( get_the_title() ) . '</span>';
		} elseif ( is_archive() ) {
			echo '<span>' . esc_html( get_the_archive_title() ) . '</span>';
		} elseif ( is_search() ) {
			echo '<span>' . esc_html__( 'Search Results', 'meeshomart' ) . '</span>';
		}

		echo '</nav>';
	}
}
