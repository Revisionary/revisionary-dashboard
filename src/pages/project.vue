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
			await store.dispatch("projects/fetchProject", params.id);

			// If project found
			if (store.getters["projects/getProject"].ID == params.id) {
				store.dispatch("pages/fetchCategories", params.id);
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
