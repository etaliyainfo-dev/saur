<?php
defined( 'ABSPATH' ) || exit;
class CFP_Activator { public static function activate(): void { CFP_Database::install(); if ( ! wp_next_scheduled( 'cfp_process_automation_queue' ) ) { wp_schedule_event( time() + HOUR_IN_SECONDS, 'hourly', 'cfp_process_automation_queue' ); } flush_rewrite_rules(); } }
