<template>
	<div id="pages" class="content">
		<SubHeader
			subtitle="Project"
			:title="project.title"
			:dataCount="dataCount"
			:description="project.description"
			:thumbnail="project.image_url"
			:isLoading="projectsFetching"
		/>

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
				project: "projects/getProject",
				blocksFetching: "projects/status"
			})
		},
		methods: {},
		created() {
			this.$store.dispatch("projects/fetchProject", this.$route.params.id);
			//if (!this.blocks.length) {
			this.$store.dispatch("projects/fetchCategories");
			this.$store.dispatch("projects/fetch");
			//}
		},
		data() {
			return {};
		}
	};
</script>

<style></style>
