<template>
	<div class="content-wrapper blocks-view">
		<div
			v-if="blocksFetching"
		>{{ this.$route.name == 'projects' ? 'Projects' : 'Pages' }} are loading...</div>

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
					<div class="block sortable" v-for="block in favoriteBlocks" :key="block.ID">
						<Block :blockData="block" />
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
					<div class="block sortable" v-for="block in blocksOfCategory(category.ID)" :key="block.ID">
						<Block :blockData="block" />
					</div>
					<div class="block add-new">
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
				type: Object
			},
			blocks: {
				type: Object
			},
			blocksFetching: {
				type: Boolean
			}
		},
		computed: {
			dataCount() {
				if (this.blocks.length) return " (" + this.blocks.length + ")";
				return "";
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
				var blocksOfCat = this.blocks.filter(function(block) {
					return block.cat_ID == cat_ID;
				});

				return blocksOfCat;
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
