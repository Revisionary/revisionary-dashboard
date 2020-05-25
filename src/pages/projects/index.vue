<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects" :dataCount="dataCount" description />

		<div class="content-wrapper">
			<div v-if="projectsFetching">Projects are loading...</div>

			<draggable
				v-else
				class="categories"
				group="categories"
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
					>
						<span class="handle" v-if="category.ID != 0">
							<MoveIcon />
						</span>
						{{ category.title }}
						<span
							class="edit tooltip-not-contained"
							v-if="category.ID != 0"
							data-tooltip="Rename Category"
						>
							<EditIcon />
						</span>
					</div>

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

	import MoveIcon from "~/components/atoms/icon-move.vue";
	import EditIcon from "~/components/atoms/icon-edit.vue";

	import SubHeader from "~/components/SubHeader.vue";
	import Block from "~/components/organisms/Block.vue";
	import AddNewBlock from "~/components/organisms/AddNewBlock.vue";
	import Footer from "~/components/Footer.vue";

	export default {
		components: {
			draggable,
			MoveIcon,
			EditIcon,
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
				projectsFetching: "projects/status"
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
</style>
