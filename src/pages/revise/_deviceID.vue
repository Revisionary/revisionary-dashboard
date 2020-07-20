<template>
	<div id="site">CURRENT PAGE: {{ $route.name }}</div>
</template>

<script>
	export default {
		layout: "app",
		async validate({ params, store }) {
			return true;
		},
		components: {},
		created() {
			console.log(this.$route);
			// this.$nextTick(() => {
			// 	this.$nuxt.$loading.start();
			// });
		}
	};
</script>

<style lang="scss">
</style>
