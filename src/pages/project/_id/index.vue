<template>
	<div class="content-wrapper">
		<BlocksView :categories="categories" :blocks="blocks" :blocksFetching="blocksFetching" />
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import BlocksView from "~/components/organisms/BlocksView.vue";

	export default {
		components: {
			BlocksView,
		},
		computed: {
			...mapGetters({
				categories: "pages/getCategories",
				blocks: "pages/get",
				blocksFetching: "pages/status",
			}),
		},
	};
</script>

<style></style>
