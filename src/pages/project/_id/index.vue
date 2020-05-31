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
					return this.$store.getters["projects/get"];
				},
				set(newList) {
					this.$store.commit("projects/set", newList);
				}
			},
			...mapGetters({
				blocksFetching: "projects/status"
			})
		},
		created() {
			this.$store.dispatch("projects/fetchCategories"); // Page Categories fetch !!!
			this.$store.dispatch("projects/fetch"); // Pages fetch !!!
		}
	};
</script>

<style></style>
