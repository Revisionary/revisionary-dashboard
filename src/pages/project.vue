<template>
	<div id="pages" class="content">
		<SubHeader data-type="page" />

		<nuxt-child />

		<Footer />
	</div>
</template>

<script>
	import SubHeader from "~/components/SubHeader.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		async validate({ params, store }) {
			// If project info already exists
			if (store.getters["projects/getProject"].ID != parseInt(params.id))
				await store.dispatch("projects/fetchProject", params.id);

			// If project found
			if (store.getters["projects/getProject"].ID == parseInt(params.id)) {
				if (
					typeof store.getters["pages/getCategories"][0] == "undefined" ||
					store.getters["pages/getCategories"][0].project_ID !=
						parseInt(params.id)
				)
					store.dispatch("pages/fetchCategories", params.id);

				if (
					typeof store.getters["pages/get"][0] == "undefined" ||
					store.getters["pages/get"][0].project_ID != parseInt(params.id)
				)
					store.dispatch("pages/fetch", params.id);

				return true;
			}
			return false;
		},
		components: {
			SubHeader,
			Footer
		}
	};
</script>

<style lang="scss">
</style>
