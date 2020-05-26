<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects" :dataCount="dataCount" description />

		<BlocksView :categories="categories" :blocks="blocks" :blocksFetching="blocksFetching" />

		<Footer />
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import SubHeader from "~/components/SubHeader.vue";
	import BlocksView from "~/components/organisms/BlocksView.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		components: {
			SubHeader,
			BlocksView,
			Footer
		},
		computed: {
			dataCount() {
				if (this.blocks.length) return " (" + this.blocks.length + ")";
				return "";
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
		methods: {},
		created() {
			this.$store.dispatch("projects/fetchCategories");
			this.$store.dispatch("projects/fetch");
			this.$store.dispatch("projects/resetProject");
		},
		data() {
			return {};
		}
	};
</script>

<style lang="scss">
</style>
