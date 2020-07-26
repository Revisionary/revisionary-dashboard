<template>
	<div id="revise" class="content">
		<TopBar />
		<nuxt-child />
	</div>
</template>

<script>
	import TopBar from "~/components/TopBar.vue";

	export default {
		layout: "app",
		components: {
			TopBar,
		},
	};
</script>
