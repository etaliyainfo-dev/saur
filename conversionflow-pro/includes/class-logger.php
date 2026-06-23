<?php
defined( 'ABSPATH' ) || exit;
class CFP_Logger { public static function log( string $type, array $meta = array(), string $status = 'info' ): void { global $wpdb; $wpdb->insert( CFP_Database::table( 'events' ), array( 'event_type' => sanitize_key( $type ), 'meta' => wp_json_encode( array_merge( $meta, array( 'status' => $status ) ) ), 'created_at' => current_time( 'mysql' ) ), array( '%s','%s','%s' ) ); } }
