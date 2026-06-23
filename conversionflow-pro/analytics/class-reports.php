<?php
defined('ABSPATH')||exit; class CFP_Reports{public function date_range(string $range):array{$today=current_time('Y-m-d'); if('last_7_days'===$range) return array(gmdate('Y-m-d',strtotime('-6 days')),$today); if('last_30_days'===$range) return array(gmdate('Y-m-d',strtotime('-29 days')),$today); return array($today,$today);}}
