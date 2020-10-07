<template>
<div>
    <b-row>
        <b-colxx xxs="12">
            <piaf-breadcrumb :heading="$t('menu.overview-3-tier')" />
            <div class="separator mb-5"></div>
        </b-colxx>
    </b-row>
    <b-row>
        <b-colxx xxs="12">
         <div no-body>
            <icon-card-panel 
              :id="tier.id"
             	:title="$t(tier.title)" 
             	:link="tier.link"
             	:icon="tier.icon" 
             	:subtitle="tier.subtitle" 
             	:value="tier.description"
            />
          </div>
         </b-colxx>
    </b-row>   
    <b-row v-if="levels">
    	<b-colxx xxs="12">
        <b-card  :title="'Curriculum Levels'">
  	      <b-tabs card no-fade v-model="levelTabIndex">
	          <b-tab v-for="(link,l_idx) in levels" :key="'level_$'+l_idx">
	            <template v-slot:title>{{ $t(link.title) }}</template>
	              <h5 class="mb-4 card-title">{{ $t(link.description) }}</h5>
	        			<b-row>
			 	          <b-tabs card no-fade v-model="detailTabIndex">
				            <b-tab v-for="(tab,t_idx) in link.tabs" :key="'level_$'+t_idx">
				                <template v-slot:title>{{ $t(tab.title) }}</template>
				                <module :modules="tab.modules"/>
				            </b-tab>
				          </b-tabs>
			          </b-row>
	            </b-tab>
	          </b-tabs>
	      </b-card>
       </b-colxx>
    </b-row>
    
 </div>
</template>

<script>

import Module from "./Module";
import IconCardPanel from "../../../../components/league/Cards/IconCardPanel";
import curriculumData from "../../../../data/league/curriculum/curriculum";

export default {
  components: {
	    "icon-card-panel": IconCardPanel,
	    "module": Module,
  },
  props: { 
	  tier: {type: Object, default() { return {} } },
	  levels: {type: Array, default() { return [] } },
  },
  data() {
	  return {
		  debug: false,
	  	levelTabIndex: 0,
	  	detailTabIndex: 0,
	  }
  },
};
</script>