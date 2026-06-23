<?php
defined( 'ABSPATH' ) || exit;
class CFP_Deactivator { public static function deactivate(): void { wp_clear_scheduled_hook( 'cfp_process_automation_queue' ); flush_rewrite_rules(); } }
