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
			return true;

			if (!store.getters["pages/getCategories"].length)
				await store.dispatch("pages/fetchCategories", params.id);

			if (
				params.category == "archived" ||
				params.category == "deleted" ||
				params.category == "mine" ||
				params.category == "shared" ||
				params.category == "favorites"
			)
				return true;

			if (
				store.getters["pages/getCategories"].find(
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
				categories: "pages/getCategories",
				blocks: "pages/get",
				blocksFetching: "pages/status"
			})
		}
	};
</script>

<style></style>
