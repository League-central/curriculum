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
          <div no-body v-for="(item,idx) in tiers" :key="`tiers_${idx}`">
            <icon-card-panel 
            	:id="item.id"
             	:title="$t(item.title)" 
             	:link="item.link"
             	:icon="item.icon" 
             	:subtitle="item.subtitle" 
             	:value="item.description"
            />
          </div>
       </b-colxx>
    </b-row>
</div>
</template>
<script>

import IconCardPanel from "../../../../components/league/Cards/IconCardPanel";
import curriculumData from "../../../../data/league/curriculum/curriculum";

export default {
  components: {
	    "icon-card-panel": IconCardPanel,
  },
  data() {
	  return {
		  tiers: {},
	  }
  },
  mounted() {
	  this.setCurriculumData();
  },
  methods: {
	  setCurriculumData() {
		  this.tiers = curriculumData.tiers;
	  }
  }
};
</script>