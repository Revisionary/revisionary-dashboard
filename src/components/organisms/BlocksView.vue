<template>
	<div class="blocks-view">
		<div
			v-if="blocksFetching"
		>{{ $route.name == 'projects' || $route.name == 'projects-category' ? 'Projects' : 'Pages' }} are loading...</div>

		<draggable
			v-else
			class="categories"
			group="categories"
			draggable=".catsortable"
			animation="200"
			handle=".category-title"
		>
			<div class="category favorites" v-if="favoriteBlocks.length && filter == null">
				<div class="category-title">Favorites</div>

				<draggable class="blocks" group="favorite-blocks" draggable=".sortable" animation="200">
					<div class="block sortable" v-for="block in favoriteBlocks" :key="block.ID">
						<Block :blockData="block" />
					</div>
				</draggable>
			</div>

			<div
				class="category"
				:class="{catsortable : category.ID != 0}"
				v-for="category in blockCategories"
				:key="category.ID"
			>
				<div
					class="category-title"
					v-if="category.ID != 0 || (category.ID == 0 && blocksOfCategory(0).length && blockCategories.length > 1 && favoriteBlocks.length)"
				>
					<span class="handle" v-if="category.ID != 0">
						<MoveIcon />
					</span>
					{{ category.title }}
					<span class="category-actions" v-if="category.ID != 0">
						<span class="tooltip-not-contained" data-tooltip="Rename Category">
							<EditIcon />
						</span>
						<span class="tooltip-not-contained" data-tooltip="Delete Category">
							<TrashIcon />
						</span>
					</span>
				</div>

				<div
					class="empty-category"
					v-if="
						(category.ID != 0 && !blocksOfCategory(category.ID).length)
						|| (category.ID == 0 && !blocksOfCategory(0).length && blockCategories.length == 1 )
					"
				>There's nothing here yet.</div>

				<draggable class="blocks" group="blocks" draggable=".sortable" animation="200">
					<div class="block sortable" v-for="block in blocksOfCategory(category.ID)" :key="block.ID">
						<Block :blockData="block" />
					</div>

					<div
						class="block add-new"
						v-if="
							(category.ID != 0 && !filter)
							|| (category.ID == 0 && blocksOfCategory(0).length && blockCategories.length > 1)
							|| (category.ID == 0 && blockCategories.length == 1)
						"
					>
						<AddNewBlock />
					</div>
				</draggable>
			</div>
		</draggable>
	</div>
</template>

<script>
	import draggable from "vuedraggable";

	import MoveIcon from "~/components/atoms/icon-move.vue";
	import EditIcon from "~/components/atoms/icon-edit.vue";
	import TrashIcon from "~/components/atoms/icon-trash.vue";

	import Block from "~/components/organisms/Block.vue";
	import AddNewBlock from "~/components/organisms/AddNewBlock.vue";

	export default {
		components: {
			draggable,
			MoveIcon,
			EditIcon,
			TrashIcon,
			Block,
			AddNewBlock
		},
		props: {
			categories: {
				type: Array
			},
			blocks: {
				type: Array
			},
			filter: {
				type: String,
				default: null
			},
			blocksFetching: {
				type: Boolean
			}
		},
		computed: {
			blockCategories() {
				if (this.filter != null)
					return this.categories.filter(category => category.ID == 0);

				return this.categories;
			},
			availableBlocks() {
				return this.blocks.filter(
					block => !block.archived && !block.deleted
				);
			},
			favoriteBlocks() {
				return this.availableBlocks.filter(block => block.favorite);
			},
			categorizedBlocks() {
				if (this.filter == "archived")
					return this.blocks.filter(
						block => block.archived && !block.deleted
					);

				if (this.filter == "deleted")
					return this.blocks.filter(block => block.deleted);

				if (this.filter == "mine")
					return this.availableBlocks.filter(
						block => block.user_ID == this.$auth.user.ID
					);

				if (this.filter == "shared")
					return this.availableBlocks.filter(
						block => block.user_ID != this.$auth.user.ID
					);

				if (this.filter == "favorites")
					return this.availableBlocks.filter(block => block.favorite);

				const foundCat = this.categories.find(
					category => category.slug == this.filter
				);
				if (foundCat)
					return this.availableBlocks.filter(
						block => block.cat_ID == foundCat.ID
					);

				// If no filter
				return this.availableBlocks;
			}
		},
		methods: {
			blocksOfCategory(cat_ID) {
				if (this.filter != null) return this.categorizedBlocks;

				return this.categorizedBlocks.filter(function(block) {
					return block.cat_ID == cat_ID;
				});
			}
		}
	};
</script>

<style lang="scss">
	.categories {
		display: grid;
		grid-template-rows: 1fr;
		gap: 55px;

		& > .category {
			.category-title {
				color: black;
				font-size: 14px;
				line-height: 17px;
				font-weight: 500;
				letter-spacing: -0.1px;
				border-bottom: 2px solid #e7e9eb;
				padding-bottom: 10px;
				margin-bottom: 20px;
				position: relative;

				& > .handle {
					position: absolute;
					right: 100%;
					padding-right: 10px;
					top: 0;
					opacity: 0;
					transition: 500ms;
					cursor: move;
				}

				& > .category-actions {
					transform: translateY(2px);
					display: inline-flex;
					margin-left: 0px;
					opacity: 0;
					transition: 500ms;
					cursor: pointer;

					& > span {
						opacity: 0;
						display: inline-block;
						margin-right: 5px;
					}
				}

				&:hover {
					& > .handle {
						opacity: 1;
					}

					& > .category-actions {
						margin-left: 5px;
						opacity: 1;

						& > span {
							opacity: 0.3;

							&:hover {
								opacity: 1;
							}
						}
					}
				}
			}

			.empty-category {
				padding: 10px 10px 30px;
				color: #9ea5ab;
				font-size: 14px;
			}
		}
	}

	.blocks {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 40px;

		& > .block {
			display: inline-block;
			vertical-align: top;
		}
	}
</style>
