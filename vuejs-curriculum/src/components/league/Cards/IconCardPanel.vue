<template>
  <div class="league-icon-panel">
    <b-card class="mb-4">
      <i :class="icon" v-if="!link"/>
			<span class="lead" v-if="!link">{{ title }}</span>
    	<b-nav v-if="link">
      	<b-nav-item :to="link">
      		<i :class="icon"/><span class="lead">{{ title }}</span>
      	</b-nav-item>
      </b-nav>
      
      <span v-if="subtitle"><h4>{{ subtitle }}</h4></span>
      <p v-if="value" class="card-text">{{ value }}</p>
      <b-nav v-if="links" vertical align="start" class="w-25" v-for="(link,index) in links" :key="'links_$'+index">
        <b-nav-item :to="link.link">{{ $t(link.title) }} - {{link.summary}}</b-nav-item>
      </b-nav>
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
	  id: {type: String, default: ''},
	  icon: { type: String, default: '' },
	  link: { type: String, default: '' },
    title: { type: String, default: 'put-title-here' },
    subtitle: { type: String, default: ''},
    value: { type: String, default: '' },
    links: {type: Array, default() { return [] } }
  }
}
</script>
