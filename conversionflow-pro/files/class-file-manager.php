<?php
defined('ABSPATH')||exit; class CFP_File_Manager{public function link(int $file_id,int $order_id,string $email):string{$exp=time()+DAY_IN_SECONDS; $token=CFP_Security::token(array($file_id,$order_id,$email,$exp)); return add_query_arg(array('cfp_download'=>$file_id,'order_id'=>$order_id,'email'=>rawurlencode($email),'expires'=>$exp,'token'=>$token),home_url('/'));}}
