<template>
	<div id="site" style="display: grid; place-items: center; height: 100%;">
		<div class="iframe-container">
			<iframe
				sandbox="allow-same-origin allow-scripts"
				id="the-page"
				name="the-page"
				:src="device.phase_url"
				scrolling="auto"
				:width="device.width"
				:height="device.height"
				:style="'min-width: '+device.width+'px; min-height: '+device.height+'px;'"
			></iframe>
		</div>
	</div>
</template>

<script>
	export default {
		layout: "app",
		components: {},
		head() {
			return {
				title:
					"Revise Page: " +
					this.device.page_name +
					" - " +
					this.device.project_name +
					"",
			};
		},
		created() {
			// this.$nextTick(() => {
			// 	this.$nuxt.$loading.start();
			// });
			// FETCH PINS HERE !!!
		},
		computed: {
			device() {
				return this.$store.getters["device/get"];
			},
		},
	};
</script>

<style lang="scss">
</style>
