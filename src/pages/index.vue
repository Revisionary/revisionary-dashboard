<template>
  <div class="container">

	  <h1>Projects</h1>
	  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam voluptatum facilis impedit similique! Vero repellat corporis omnis expedita eveniet dolores voluptatibus quod cum illum quia nulla, quasi amet quos velit?</p>

	  <br>
	  <div v-if="!isLoaded">Loading the projects...</div>
	  <ul>
		<li v-for="post in posts" v-bind:key="post.id"><nuxt-link :to="`project/${post.id}`">{{ post.title }}</nuxt-link></li>
	  </ul>

  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  components: {
	//Logo
  },
  data() {
	return {
	  isLoaded: false,
	  posts: []
	}
  },
  async created() {

	this.fetchPosts();

  },
  methods: {
	async fetchPosts() {

	  const resp = await this.$axios.$get('https://jsonplaceholder.typicode.com/posts');
	  if (resp) {

		this.posts = resp.splice(0,5);
		this.isLoaded = true;

	  }

	}
  },
}
</script>

<style>

</style>
