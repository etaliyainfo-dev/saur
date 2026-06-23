<?php
defined('ABSPATH')||exit; class CFP_File_Access{public function allowed(int $file_id,int $order_id,string $email):bool{$order=wc_get_order($order_id); return $order && strtolower($order->get_billing_email())===strtolower($email) && in_array($order->get_status(),array('processing','completed'),true);}}
