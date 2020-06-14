<template>
	<div id="projects" class="content">
		<SubHeader data-type="project" />

		<nuxt-child />

		<Footer />
	</div>
</template>

<script>
	import SubHeader from "~/components/SubHeader.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		components: {
			SubHeader,
			Footer
		},
		created() {
			if (!this.$store.getters["projects/getCategories"].length)
				this.$store.dispatch("projects/fetchCategories");

			this.$store.dispatch("projects/fetch");
		}
	};
</script>

<style lang="scss">
</style>
