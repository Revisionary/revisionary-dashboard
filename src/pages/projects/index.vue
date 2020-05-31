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
			BlocksView
		},
		computed: {
			...mapGetters({
				categories: "projects/getCategories",
				blocks: "projects/get",
				blocksFetching: "projects/status"
			})
		}
	};
</script>

<style lang="scss">
</style>
