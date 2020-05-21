<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects" :dataCount="dataCount" description />

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
					<div
						class="category-title"
						v-if="(category.ID == 0 && blocksOfCategory(category.ID).length) && categories.length > 1 || category.ID != 0"
					>{{ category.title }}</div>

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
	.content-wrapper {
		padding-top: 55px;
		padding-bottom: 55px;
		padding-left: 55px;
		padding-right: 55px;
	}

	.categories {
		& > .category {
			padding-bottom: 15px;

			.category-title {
				color: black;
				font-weight: 500;
				font-size: 14px;
				line-height: 17px;
				letter-spacing: -0.0933333px;
				border-bottom: 2px solid #e7e9eb;
				padding-bottom: 10px;
			}

			&.sortable-ghost {
				opacity: 0.3;
			}
		}
	}

	.blocks {
		padding-top: 20px;
		margin-left: -20px;
		margin-right: -20px;
		display: flex;
		flex-wrap: wrap;

		& > .block {
			display: inline-block;
			padding: 0 20px 40px;
			width: 25%;
			min-height: 340px;
			vertical-align: top;

			&.sortable-ghost {
				& > .card {
					opacity: 0.3;
				}
			}
		}
	}
</style>
