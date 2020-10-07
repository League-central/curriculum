<template>
<div>
	<curriculum-tier :tier="tier" :levels="levels"/>
</div>	
</template>

<script>

import Tier from "../Tier";
import curriculumData from "../../../../../data/league/curriculum/curriculum";
import curriculumLevels from "../../../../../data/league/curriculum/associate_programmer/levels";

export default {
  components: {
	    "curriculum-tier": Tier,
  },
  data() {
	  return {
		  debug: false,
	  	tier: {},
	  	levels: curriculumLevels.list,
	  }
  },
  mounted() {
	  this.setTier();
  },
  methods: {
	  setTier() {
		  // Get the tier description and summary
		  this.tier = curriculumData.tiers.find(tier=>tier.id=='associate-programmer')
			if(this.debug) console.log(this.tier.id);
	  },
  }
  
};
</script>
