<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects" :dataCount="dataCount" description />

		<div class="scrollable">
			<draggable
				class="categories"
				v-model="categories"
				group="categories"
				v-if="isProjectsLoaded"
				draggable=".catsortable"
			>
				<div class="category favorites" v-if="favoriteBlocks.length">
					<div class="category-title">Favorites</div>

					<draggable
						class="blocks"
						v-model="projects"
						group="favorite-blocks"
						v-if="isProjectsLoaded"
						draggable=".sortable"
					>
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

					<draggable
						class="blocks"
						v-model="projects"
						group="projects"
						v-if="isProjectsLoaded"
						draggable=".sortable"
					>
						<div
							class="block sortable"
							v-for="project in blocksOfCategory(category.ID)"
							:key="project.ID"
						>
							<Block :blockData="project" />
						</div>
					</draggable>
				</div>
			</draggable>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import draggable from "vuedraggable";

	import SubHeader from "~/components/SubHeader.vue";
	import Block from "~/components/organisms/Block.vue";

	export default {
		components: {
			draggable,
			SubHeader,
			Block
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
				isProjectsLoaded: "projects/status"
			}),
			dataCount() {
				if (this.projects.length) return " (" + this.projects.length + ")";
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
			this.$store.dispatch("projects/fetchCategories");
			this.$store.dispatch("projects/fetch");
			this.$store.dispatch("projects/resetProject");
		},
		data() {
			return {
				catOrder: []
			};
		}
	};
</script>

<style lang="scss">
	.scrollable {
		padding-top: 55px;
		padding-bottom: 55px;
		padding-left: 55px;
		padding-right: 55px;
	}

	.categories {
		& > .category {
			padding-bottom: 15px;

			.category-title {
			}

			&.sortable-ghost {
				opacity: 0.2;
			}
		}
	}

	.blocks {
		padding-top: 20px;
		margin-left: -20px;
		margin-right: -20px;

		& > .block {
			display: inline-block;
			padding: 0 20px 40px;
			width: 25%;

			&.sortable-ghost {
				& > .card {
					opacity: 0.2;
				}
			}
		}
	}
</style>
