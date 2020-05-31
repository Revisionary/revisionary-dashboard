<template>
	<div class="content-wrapper">
		<BlocksView
			:categories="categories"
			:blocks="blocks"
			:blocksFetching="blocksFetching"
			:filter="filter"
		/>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import BlocksView from "~/components/organisms/BlocksView.vue";

	export default {
		validate({ params, store }) {
			if (
				params.category == "archived" ||
				params.category == "deleted" ||
				params.category == "mine" ||
				params.category == "shared"
			)
				return true;
			// return store.getters["projects/getCategories"].some(
			// 	category => category.ID === params.id
			// );
			return true;
		},
		components: {
			BlocksView
		},
		computed: {
			filter() {
				return this.$route.params.category;
			},
			categories: {
				get() {
					return this.$store.getters["projects/getCategories"];
				},
				set(newList) {
					this.$store.commit("projects/setCategories", newList);
				}
			},
			blocks: {
				get() {
					if (this.filter == "archived")
						return this.$store.getters["projects/get"].filter(
							block => block.archived
						);

					if (this.filter == "deleted")
						return this.$store.getters["projects/get"].filter(
							block => block.deleted
						);

					if (this.filter == "mine")
						return this.$store.getters["projects/get"].filter(
							block => block.user_ID == this.$store.state.authUser.ID
						);

					if (this.filter == "shared")
						return this.$store.getters["projects/get"].filter(
							block => block.user_ID != this.$store.state.authUser.ID
						);

					if (this.filter == "favorites")
						return this.$store.getters["projects/get"].filter(
							block => block.favorite
						);

					return this.$store.getters["projects/get"];
				},
				set(newList) {
					this.$store.commit("projects/set", newList);
				}
			},
			...mapGetters({
				project: "projects/getProject",
				blocksFetching: "projects/status"
			})
		},
		created() {
			if (!this.categories.length)
				this.$store.dispatch("projects/fetchCategories");

			if (!this.blocks.length) this.$store.dispatch("projects/fetch");
		}
	};
</script>

<style></style>
