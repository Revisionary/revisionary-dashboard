<template>
	<div id="pages" class="content">
		<SubHeader
			subtitle="Project"
			:title="project.title"
			:description="project.body"
			:isLoading="!isLoaded"
		/>

		<div class="blocks">
			<div v-if="!isLoaded">Loading the Pages...</div>
			<br />
			<br />
			<nuxt-link to="/">&lt; Projects</nuxt-link>
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
				project: "projects/getProject",
				isLoaded: "projects/status"
			})
		},
		created() {
			this.$store.dispatch("projects/getProject", this.$route.params.id);
		}
	};
</script>

<style></style>
