<template>
	<div id="site" style="display: grid; place-items: center;">
		<p>CURRENT PAGE: {{ $route.name }}</p>
		<p>CURRENT PAGE ID: {{ $route.params.deviceID }}</p>
	</div>
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
		},
	};
</script>

<style lang="scss">
</style>
