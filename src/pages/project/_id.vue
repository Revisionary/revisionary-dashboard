<template>
	<div id="pages" class="content">
		<SubHeader
			subtitle="Project"
			:title="project.title"
			:dataCount="dataCount"
			:description="project.description"
			:isLoading="!isProjectsLoaded"
		/>

		<div class="content-wrapper">
			<draggable
				class="categories"
				group="categories"
				v-if="isProjectsLoaded"
				draggable=".catsortable"
				animation="200"
				handle=".category-title"
			>
				<div class="category favorites" v-if="favoriteBlocks.length">
					<div class="category-title">Favorites</div>

					<draggable class="blocks" group="favorite-blocks" draggable=".sortable" animation="200">
						<div class="block sortable" v-for="project in favoriteBlocks" :key="project.ID">
							<Block :blockData="project" />
						</div>
					</draggable>
				</div>

				<div
					class="category"
					:class="{catsortable : category.ID != 0}"
					v-for="category in categories"
					:key="category.ID"
				>
					<div class="category-title">{{ category.title }}</div>

					<draggable class="blocks" group="blocks" draggable=".sortable" animation="200">
						<div
							class="block sortable"
							v-for="project in blocksOfCategory(category.ID)"
							:key="project.ID"
						>
							<Block :blockData="project" />
						</div>
						<div class="block add-new">
							<AddNewBlock />
						</div>
					</draggable>
				</div>
			</draggable>
		</div>

		<Footer />
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import draggable from "vuedraggable";

	import SubHeader from "~/components/SubHeader.vue";
	import Block from "~/components/organisms/Block.vue";
	import AddNewBlock from "~/components/organisms/AddNewBlock.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		components: {
			draggable,
			SubHeader,
			Footer,
			Block,
			AddNewBlock
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
			projects: {
				get() {
					return this.$store.getters["projects/get"];
				},
				set(newList) {
					this.$store.commit("projects/set", newList);
				}
			},
			...mapGetters({
				project: "projects/getProject",
				isProjectsLoaded: "projects/status"
			}),
			dataCount() {
				var count = 3;
				if (count) return " (" + count + ")";
				return "";
			},
			favoriteBlocks() {
				var blocks = this.projects.filter(function(block) {
					return block.favorite;
				});

				return blocks;
			}
		},
		methods: {
			blocksOfCategory(cat_ID) {
				var blocksOfCat = this.projects.filter(function(block) {
					return block.cat_ID == cat_ID;
				});

				return blocksOfCat;
			}
		},
		created() {
			this.$store.dispatch("projects/fetchProject", this.$route.params.id);
		},
		data() {
			return {
				isPageLoaded: false
			};
		}
	};
</script>

<style></style>
