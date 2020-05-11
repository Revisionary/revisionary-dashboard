<template>
	<div id="pages" class="content">
		<SubHeader
			subtitle="Project"
			:title="project.project_title"
			:dataCount="dataCount"
			:description="project.body"
			:isLoading="!isProjectLoaded"
		/>

		<div class="blocks">
			<div v-if="!isProjectLoaded">Loading the Pages...</div>
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
				isProjectLoaded: "projects/status"
			}),
			dataCount() {
				var count = 3;
				if (count) return " (" + count + ")";
				return "";
			}
		},
		created() {
			this.$store.dispatch("projects/getProject", this.$route.params.id);
		},
		data() {
			return {
				//isProjectLoaded: false
			};
		}
	};
</script>

<style></style>
