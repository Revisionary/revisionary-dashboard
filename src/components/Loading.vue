<template>
	<div class="loading-page" v-show="loading">
		<p>Loading...</p>
		<p v-if="failed">Failed</p>
	</div>
</template>

<script>
	export default {
		data: () => ({
			loading: false,
			percentage: 0,
			failed: false,
			error: null
		}),
		methods: {
			start() {
				this.loading = true;
				this.percentage = 0;
			},
			finish() {
				this.loading = false;
				this.percentage = 100;
			},
			fail(error) {
				this.failed = true;
				this.error = error;
			},
			increase(num) {}
		}
	};
</script>

<style scoped>
	.loading-page {
		position: fixed;
		z-index: 9;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.8);
		text-align: center;
		padding-top: 200px;
		font-size: 30px;
		font-family: sans-serif;
	}
</style>
