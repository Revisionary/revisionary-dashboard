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
			<div
				class="category favorites"
				v-if="favoriteBlocks.length && filter != 'archived' && filter != 'deleted' && filter != 'mine' && filter != 'shared' && filter != 'favorites'"
			>
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
					v-if="category.ID != 0 || (category.ID == 0 && blocksOfCategory(0).length && blockCategories.length > 1)"
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

				<div
					class="empty-category"
					v-if="!blocksOfCategory(category.ID).length && (category.ID != 0 && blockCategories.length > 1)"
				>There's nothing here yet.</div>

				<draggable class="blocks" group="blocks" draggable=".sortable" animation="200">
					<div class="block sortable" v-for="block in blocksOfCategory(category.ID)" :key="block.ID">
						<Block :blockData="block" />
					</div>

					<div class="block add-new" v-if="!filter">
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

	import Block from "~/components/organisms/Block.vue";
	import AddNewBlock from "~/components/organisms/AddNewBlock.vue";

	export default {
		components: {
			draggable,
			MoveIcon,
			EditIcon,
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
				if (
					this.filter == "archived" ||
					this.filter == "deleted" ||
					this.filter == "mine" ||
					this.filter == "shared" ||
					this.filter == "favorites"
				)
					return this.categories.filter(category => category.ID == 0);

				return this.categories;
			},
			favoriteBlocks() {
				var blocks = this.blocks.filter(function(block) {
					return block.favorite;
				});

				return blocks;
			}
		},
		methods: {
			blocksOfCategory(cat_ID) {
				if (
					this.filter == "archived" ||
					this.filter == "deleted" ||
					this.filter == "mine" ||
					this.filter == "shared" ||
					this.filter == "favorites"
				)
					return this.blocks;

				return this.blocks.filter(function(block) {
					return block.cat_ID == cat_ID;
				});
			}
		},
		data() {
			return {};
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

				& > .edit {
					transform: translateY(2px);
					display: inline-block;
					margin-left: 0px;
					opacity: 0;
					transition: 500ms;
					cursor: pointer;
				}

				&:hover {
					& > .handle {
						opacity: 1;
					}

					& > .edit {
						margin-left: 5px;
						opacity: 0.3;

						&:hover {
							opacity: 1;
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
