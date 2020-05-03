<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects (3)" description />

		<div class="blocks">
			<div v-if="!isLoaded">Loading the projects...</div>
			<ul v-if="isLoaded">
				<li v-for="project in projects" v-bind:key="project.id">
					<nuxt-link :to="`project/${project.id}`">{{ project.title }}</nuxt-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import SubHeader from "~/components/SubHeader.vue";

	export default {
		components: {
			SubHeader
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				isLoaded: "projects/status"
			})
		},
		created() {
			this.$store.dispatch("projects/get");
		}
	};
</script>

<style></style>
