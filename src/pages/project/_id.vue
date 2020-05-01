<template>
  <div class="container">

	  <div v-if="!isLoaded">Loading the Pages...</div>

	  <h1>{{project.title}}</h1>
	  <p>{{project.body}}</p>

	  <br><br><nuxt-link to="/">&lt; Projects</nuxt-link>

  </div>
</template>

<script>
export default {
  components: {
	//Logo
  },
  data() {
	return {
		isLoaded: false,
		project: {}
	}
  },
  async created() {

	this.fetchPages();
	
  },
  methods: {
	async fetchPages() {

	  const resp = await this.$axios.$get(`https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`);
	  if (resp) {

		this.project = resp;
		this.isLoaded = true;

	  }

	}
  },
}
</script>

<style>

</style>
