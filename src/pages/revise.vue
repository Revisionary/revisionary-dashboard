<template>
	<div id="revise" class="content">
		<nuxt-child />
	</div>
</template>

<script>
	export default {
		layout: "app",
		async validate({ params, store }) {
			// Fetch the device data
			await store.dispatch("device/fetch", params.id);

			// If device found
			if (store.getters["device/get"].ID == params.id) return true;

			// If device not found
			return false;
		},
		components: {},
		created() {
			// this.$nextTick(() => {
			// 	this.$nuxt.$loading.start();
			// });
			//this.$store.dispatch("pins/fetch");
		},
	};
</script>

<style lang="scss">
</style>
