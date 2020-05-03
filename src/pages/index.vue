<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects (3)" description />

		<div class="blocks">
			<div v-if="!isLoaded">Loading the projects...</div>
			<ul>
				<li v-for="project in projects" v-bind:key="project.id">
					<nuxt-link :to="`project/${project.id}`">{{ project.title }}</nuxt-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import SubHeader from "~/components/SubHeader.vue";

	export default {
		components: {
			SubHeader
		},
		data() {
			return {
				isLoaded: false,
				projects: []
			};
		},
		async created() {
			this.fetchProjects();
		},
		methods: {
			async fetchProjects() {
				const resp = await this.$axios.$get(
					"https://jsonplaceholder.typicode.com/posts"
				);
				if (resp) {
					this.projects = resp.splice(0, 5);
					this.isLoaded = true;
				}
			}
		}
	};
</script>

<style></style>
