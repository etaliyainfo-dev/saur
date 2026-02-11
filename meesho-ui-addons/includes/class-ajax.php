<?php
/**
 * Ajax endpoints class.
 */

defined( 'ABSPATH' ) || exit;

final class Meesho_UI_Addons_Ajax {
	private static ?self $instance = null;

	public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'wp_ajax_meesho_ui_wishlist', array( $this, 'wishlist_endpoint' ) );
		add_action( 'wp_ajax_nopriv_meesho_ui_wishlist', array( $this, 'wishlist_endpoint' ) );
	}

	public function wishlist_endpoint(): void {
		check_ajax_referer( 'meesho_ui_wishlist', 'nonce' );
		$action_name = isset( $_REQUEST['wishlist_action'] ) ? sanitize_key( wp_unslash( $_REQUEST['wishlist_action'] ) ) : 'list';
		$product_id  = isset( $_REQUEST['product_id'] ) ? absint( wp_unslash( $_REQUEST['product_id'] ) ) : 0;
		$user_id     = get_current_user_id();
		$wishlist    = Meesho_UI_Addons_Wishlist::instance();
		$items       = $wishlist->get_items( $user_id );

		if ( 'add' === $action_name && $product_id ) {
			$items[] = $product_id;
			$items   = array_values( array_unique( $items ) );
			$wishlist->set_items( $items, $user_id );
		}

		if ( 'remove' === $action_name && $product_id ) {
			$items = array_values( array_filter( $items, static fn( $id ) => (int) $id !== $product_id ) );
			$wishlist->set_items( $items, $user_id );
		}

		wp_send_json_success(
			array(
				'items' => $items,
				'count' => count( $items ),
			)
		);
	}
}
