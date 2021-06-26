<template>
	<div>
	
		<b-row>
    	<b-colxx xxs="12">
       	<div v-for="(module,m_idx) in modules" :key="'module_$'+m_idx">
            <b-button v-b-toggle=module.id variant="link">{{ $t(module.title) }} - {{ module.summary }}</b-button>
            <b-collapse :id=module.id >
                <div v-if="module.topics" class="topics" v-for="(topic,t_idx) in module.topics" :key="'topic_$'+t_idx">
                    <strong>{{ topic.title }}</strong>
                    <p v-if="topic.description">{{ topic.description }}</p>
                    <ul v-if="topic.links">
                    	<li v-for="(link,l_idx) in topic.links" :key="'link_$'+l_idx">
                    		<a class="btn-link" :href="link.url">{{ link.text }}</a> <span v-if="link.description"> - {{ link.description }} </span>
                    	</li>
                    </ul>
                </div>
            </b-collapse>
        </div>
    	</b-colxx>
		</b-row>	
	
	</div>
</template>

<script>
	export default {
		  props: { 
			  modules: {type: Array, default() { return [] } },
		  },
		  data() {
			  return {
			  	debug: false,
			  }
		  },
		  mounted() {
			  this.showModules();
		  },
		  methods: {
			  showModules() {
				  if(this.debug) {
					  console.log("modules array = " + this.modules);
				  }
			  }
		  },
	};
</script>