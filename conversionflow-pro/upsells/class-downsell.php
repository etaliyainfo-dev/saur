<?php
defined('ABSPATH')||exit; class CFP_Downsell{public function reject(int $order_id):void{(new CFP_Tracking())->track('upsell_rejected',0,0,$order_id);} }
