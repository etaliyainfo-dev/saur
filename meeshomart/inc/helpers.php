<?php
/**
 * Helper functions.
 *
 * @package MeeshoMart
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'meeshomart_get_setting' ) ) {
	/**
	 * Get theme mod with fallback.
	 *
	 * @param string $key     Theme mod key.
	 * @param mixed  $default Default value.
	 * @return mixed
	 */
	function meeshomart_get_setting( string $key, $default = '' ) {
		return get_theme_mod( $key, $default );
	}
}

if ( ! function_exists( 'meeshomart_svg_icon' ) ) {
	/**
	 * Output a small inline icon.
	 *
	 * @param string $icon Icon key.
	 * @return string
	 */
	function meeshomart_svg_icon( string $icon ): string {
		$icons = array(
			'home'       => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5v8.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
			'grid'       => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"/></svg>',
			'search'     => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14m11 17-4.2-4.2" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"/></svg>',
			'cart'       => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>',
			'user'       => '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
			'close'      => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
			'filter'     => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
			'menu'       => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
			'chevron-r'  => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
			'badge-sale' => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l3.2 3.2L20 6l-1.2 4.8L22 14l-3.2 3.2L20 22l-4.8-1.2L12 24l-3.2-3.2L4 22l1.2-4.8L2 14l3.2-3.2L4 6l4.8-.8z"/></svg>',
		);

		return isset( $icons[ $icon ] ) ? $icons[ $icon ] : '';
	}
}
