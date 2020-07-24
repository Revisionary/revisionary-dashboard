<template>
	<div id="site" style="display: grid; place-items: center; height: 100%;">
		<div>
			<p>CURRENT PAGE: {{ $route.name }}</p>
			<p>CURRENT PAGE ID: {{ $route.params.deviceID }}</p>
		</div>
	</div>
</template>

<script>
	export default {
		layout: "app",
		async validate({ params, store }) {
			return true;
		},
		components: {},
		head() {
			return {
				title: "Revise Page: Home - Scene12",
			};
		},
		created() {
			console.log(this.$store.getters["projects/project"]);
			// this.$nextTick(() => {
			// 	this.$nuxt.$loading.start();
			// });
		},
	};
</script>

<style lang="scss">
</style>
