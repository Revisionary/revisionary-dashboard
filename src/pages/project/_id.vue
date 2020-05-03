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
	import SubHeader from "~/components/molecules/SubHeader.vue";

	export default {
		components: {
			SubHeader
		},
		data() {
			return {
				isLoaded: false,
				project: {}
			};
		},
		async created() {
			this.fetchPages();
		},
		methods: {
			async fetchPages() {
				const resp = await this.$axios.$get(
					`https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`
				);
				if (resp) {
					this.project = resp;
					this.isLoaded = true;
				}
			}
		}
	};
</script>

<style></style>
