<?php
defined( 'ABSPATH' ) || exit;
class CFP_REST_API { public function hooks(): void { add_action( 'rest_api_init', array( $this, 'routes' ) ); } public function routes(): void { register_rest_route( 'conversionflow-pro/v1', '/funnels', array( 'methods' => 'GET', 'callback' => array( $this, 'funnels' ), 'permission_callback' => array( 'CFP_Security', 'can_manage' ) ) ); } public function funnels(): WP_REST_Response { return rest_ensure_response( ( new CFP_Funnels() )->all() ); } }
