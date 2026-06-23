<?php
defined('ABSPATH')||exit; class CFP_Fields{public function filter(array $fields):array{return apply_filters('cfp_checkout_fields',$fields);} }
