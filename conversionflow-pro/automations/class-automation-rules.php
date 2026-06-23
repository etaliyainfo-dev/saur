<?php
defined('ABSPATH')||exit; class CFP_Automation_Rules{public function matches(array $conditions,array $ctx):bool{foreach($conditions as $k=>$v){if(isset($ctx[$k]) && (string)$ctx[$k] !== (string)$v) return false;} return true;}}
