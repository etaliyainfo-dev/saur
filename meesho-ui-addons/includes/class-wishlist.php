<?php
/**
 * Wishlist class.
 */

defined( 'ABSPATH' ) || exit;

final class Meesho_UI_Addons_Wishlist {
	private static ?self $instance = null;
	private const META_KEY = '_meesho_ui_wishlist';

	public static function instance(): self {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_shortcode( 'meesho_wishlist', array( $this, 'render_shortcode' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'wp_login', array( $this, 'sync_guest_to_user' ), 10, 2 );
	}

	public function enqueue(): void {
		wp_enqueue_style( 'meesho-ui-wishlist', MEESHO_UI_ADDONS_URL . 'assets/css/wishlist.css', array(), MEESHO_UI_ADDONS_VERSION );
		wp_enqueue_script( 'meesho-ui-wishlist', MEESHO_UI_ADDONS_URL . 'assets/js/wishlist.js', array(), MEESHO_UI_ADDONS_VERSION, array( 'strategy' => 'defer', 'in_footer' => true ) );
		wp_localize_script(
			'meesho-ui-wishlist',
			'MeeshoWishlist',
			array(
				'ajaxUrl' => esc_url_raw( admin_url( 'admin-ajax.php' ) ),
				'nonce'   => wp_create_nonce( 'meesho_ui_wishlist' ),
			)
		);
	}

	public function get_items( int $user_id = 0 ): array {
		if ( $user_id > 0 ) {
			$items = get_user_meta( $user_id, self::META_KEY, true );
			return is_array( $items ) ? array_map( 'absint', $items ) : array();
		}
		return meesho_ui_addons_get_guest_wishlist();
	}

	public function set_items( array $items, int $user_id = 0 ): void {
		$items = array_values( array_unique( array_map( 'absint', $items ) ) );
		if ( $user_id > 0 ) {
			update_user_meta( $user_id, self::META_KEY, $items );
			return;
		}
		setcookie( 'meesho_ui_wishlist', wp_json_encode( $items ), time() + ( WEEK_IN_SECONDS * 12 ), COOKIEPATH ?: '/', COOKIE_DOMAIN, is_ssl(), true );
	}

	public function render_shortcode(): string {
		ob_start();
		include MEESHO_UI_ADDONS_PATH . 'templates/wishlist-page.php';
		return (string) ob_get_clean();
	}

	public function sync_guest_to_user( string $user_login, WP_User $user ): void {
		$guest_items = meesho_ui_addons_get_guest_wishlist();
		if ( empty( $guest_items ) ) {
			return;
		}
		$current = $this->get_items( (int) $user->ID );
		$this->set_items( array_merge( $current, $guest_items ), (int) $user->ID );
	}
}
