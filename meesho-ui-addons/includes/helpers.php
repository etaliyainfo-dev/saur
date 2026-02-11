<?php
/**
 * Helper functions for plugin.
 */

defined( 'ABSPATH' ) || exit;

function meesho_ui_addons_get_guest_wishlist(): array {
	if ( empty( $_COOKIE['meesho_ui_wishlist'] ) ) {
		return array();
	}
	$data = json_decode( stripslashes( (string) $_COOKIE['meesho_ui_wishlist'] ), true );
	if ( ! is_array( $data ) ) {
		return array();
	}
	return array_map( 'absint', $data );
}
