<template>
	<div class="content-wrapper">
		<BlocksView
			:categories="categories"
			:blocks="blocks"
			:blocksFetching="blocksFetching"
			:filter="$route.params.category"
		/>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import BlocksView from "~/components/organisms/BlocksView.vue";

	export default {
		async validate({ params, store }) {
			if (!store.getters["projects/getCategories"].length)
				await store.dispatch("projects/fetchCategories"); // Page Cat !!!

			if (
				params.category == "archived" ||
				params.category == "deleted" ||
				params.category == "mine" ||
				params.category == "shared" ||
				params.category == "favorites"
			)
				return true;

			if (
				store.getters["projects/getCategories"].find(
					// Page Cat !!!
					category => category.slug == params.category
				)
			)
				return true;

			return false;
		},
		components: {
			BlocksView
		},
		computed: {
			...mapGetters({
				// Pages !!!
				categories: "projects/getCategories",
				blocks: "projects/get",
				blocksFetching: "projects/status"
			})
		}
	};
</script>

<style></style>
