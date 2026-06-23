<?php
defined('ABSPATH')||exit; class CFP_Checkout{public function hooks():void{add_shortcode('cfp_checkout',array($this,'render'));} public function render():string{if(!function_exists('WC')) return ''; ob_start(); echo '<div class="cfp-checkout">'; echo do_shortcode('[woocommerce_checkout]'); echo '</div>'; return ob_get_clean();}}
