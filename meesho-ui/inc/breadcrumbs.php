<?php
/**
 * Breadcrumbs.
 *
 * @package MeeshoUI
 */

defined( 'ABSPATH' ) || exit;

function meesho_ui_breadcrumbs(): void {
	if ( is_front_page() ) {
		return;
	}

	echo '<nav class="meesho-breadcrumb" aria-label="' . esc_attr__( 'Breadcrumb', 'meesho-ui' ) . '">';
	echo '<a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'meesho-ui' ) . '</a>';

	if ( is_product_category() || is_category() ) {
		echo '<span aria-hidden="true">&gt;</span><span>' . esc_html( single_term_title( '', false ) ) . '</span>';
	} elseif ( is_singular( 'product' ) ) {
		$terms = get_the_terms( get_the_ID(), 'product_cat' );
		if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			$term = array_shift( $terms );
			echo '<span aria-hidden="true">&gt;</span><a href="' . esc_url( get_term_link( $term ) ) . '">' . esc_html( $term->name ) . '</a>';
		}
		echo '<span aria-hidden="true">&gt;</span><span>' . esc_html( get_the_title() ) . '</span>';
	} elseif ( is_search() ) {
		echo '<span aria-hidden="true">&gt;</span><span>' . esc_html__( 'Search', 'meesho-ui' ) . '</span>';
	} else {
		echo '<span aria-hidden="true">&gt;</span><span>' . esc_html( wp_get_document_title() ) . '</span>';
	}
	echo '</nav>';
}
