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
		layout: "app",
		async validate({ params, store }) {
			// If project info not exists
			if (store.getters["projects/getProject"].ID != params.id)
				await store.dispatch("projects/fetchProject", params.id);

			// If project found
			if (store.getters["projects/getProject"].ID == params.id) return true;

			// If project not found
			return false;
		},
		head() {
			return {
				title:
					this.$store.getters["projects/getProject"].title +
					" Project | Revisionary",
			};
		},
		components: {
			SubHeader,
			Footer,
		},
		created() {
			this.$nextTick(() => {
				this.$nuxt.$loading.start();
			});
			this.$store.dispatch("pages/fetch", this.$route.params.id);
		},
		watch: {
			$route(to, from) {
				// console.log("FROM: ", from);
				// console.log("TO: ", to);

				if (from.params.id != to.params.id) {
					this.$nextTick(() => {
						this.$nuxt.$loading.start();
					});

					this.$store.dispatch("pages/fetch", this.$route.params.id);
				}
			},
		},
	};
</script>

<style lang="scss">
</style>
