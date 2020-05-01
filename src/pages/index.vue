<template>
  <div class="content">

      <header>

        <div class="subtitle">HUB</div>
        <h1>My Projects (3) <ChevronDownIcon /></h1>
        <p class="project-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam voluptatum facilis impedit similique! Vero repellat corporis omnis expedita eveniet dolores voluptatibus quod cum illum quia nulla, quasi amet quos velit?</p>

      </header>

      <div class="blocks">

        <br>
        <div v-if="!isLoaded">Loading the projects...</div>
        <ul>
            <li v-for="project in projects" v-bind:key="project.id"><nuxt-link :to="`project/${project.id}`">{{ project.title }}</nuxt-link></li>
        </ul>

      </div>




  </div>
</template>

<script>
import ChevronDownIcon from '~/components/atoms/icon-chevron-down.vue'

export default {
  components: {
	ChevronDownIcon
  },
  data() {
	return {
	  isLoaded: false,
	  projects: []
	}
  },
  async created() {

	this.fetchProjects();

  },
  methods: {
	async fetchProjects() {

	  const resp = await this.$axios.$get('https://jsonplaceholder.typicode.com/posts');
	  if (resp) {

		this.projects = resp.splice(0,5);
		this.isLoaded = true;

	  }

	}
  },
}
</script>

<style>

</style>
