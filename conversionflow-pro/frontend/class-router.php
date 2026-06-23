<?php
defined('ABSPATH')||exit; class CFP_Router{public function hooks():void{add_action('template_redirect',array($this,'maybe_track'));} public function maybe_track():void{ if(is_page()&&get_post_meta(get_the_ID(),'_cfp_funnel_id',true)){(new CFP_Tracking())->track('visit',(int)get_post_meta(get_the_ID(),'_cfp_funnel_id',true),0,0,'');}}}
