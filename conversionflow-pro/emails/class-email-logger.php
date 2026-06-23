<?php
defined('ABSPATH')||exit; class CFP_Email_Logger{public function log(string $to,string $subject,string $status):void{global $wpdb; $wpdb->insert(CFP_Database::table('email_logs'),array('customer_email'=>sanitize_email($to),'status'=>sanitize_key($status),'event_type'=>'email','meta'=>wp_json_encode(array('subject'=>$subject)),'created_at'=>current_time('mysql')));}}
