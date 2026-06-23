<?php
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) { exit; }
global $wpdb; $tables=array('funnels','steps','events','analytics','automations','automation_logs','emails','email_logs','files','downloads','abandoned_checkouts','webhooks','webhook_logs','settings'); foreach($tables as $table){$wpdb->query('DROP TABLE IF EXISTS '.$wpdb->prefix.'cfp_'.$table);} delete_option('cfp_db_version');
