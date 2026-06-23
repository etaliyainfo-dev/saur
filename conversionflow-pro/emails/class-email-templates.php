<?php
defined('ABSPATH')||exit; class CFP_Email_Templates{public static function render(string $type,array $vars=array()):string{return '<html><body><h1>'.esc_html(get_bloginfo('name')).'</h1><p>'.esc_html__('Your requested update is ready.','conversionflow-pro').'</p>{download_link}</body></html>';}}
