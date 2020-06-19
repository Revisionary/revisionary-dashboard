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
			return store.getters["projects/getProject"].ID == params.id;
		},
		components: {
			SubHeader,
			Footer
		},
		created() {
			this.$store.dispatch("pages/fetchCategories", this.$route.params.id);
			this.$store.dispatch("pages/fetch");
		}
	};
</script>

<style lang="scss">
</style>
