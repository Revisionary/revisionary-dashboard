<template>
	<div id="revise" class="content">
		<nuxt-child />
	</div>
</template>

<script>
	export default {
		layout: "app",
		components: {},
		created() {
			// this.$nextTick(() => {
			// 	this.$nuxt.$loading.start();
			// });
			//this.$store.dispatch("projects/fetch");
		},
	};
</script>

<style lang="scss">
</style>
