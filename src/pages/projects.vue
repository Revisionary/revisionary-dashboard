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
		}
	};
</script>

<style lang="scss">
</style>
