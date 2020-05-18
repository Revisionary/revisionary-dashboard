<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" title="My Projects" :dataCount="dataCount" description />

		<draggable
			class="categories"
			v-model="categories"
			group="categories"
			@start="drag = true"
			@end="drag = false"
			v-if="isProjectsLoaded"
			draggable=".sortable"
		>
			<div :class="{sortable : category.ID != 0}" v-for="category in categories" :key="category.ID">
				<div class="cat-title">{{ category.title }}</div>

				<draggable
					class="blocks"
					v-model="projects"
					group="projects"
					@start="drag = true"
					@end="drag = false"
					v-if="isProjectsLoaded"
					draggable=".sortable"
				>
					<div class="sortable" v-for="project in projects" :key="project.ID">
						<Block :blockData="project" />
					</div>
				</draggable>
			</div>
		</draggable>
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
				//categories: "projects/getCategories",
				//projects: "projects/get",
				isProjectsLoaded: "projects/status"
			}),
			dataCount() {
				if (this.projects.length) return " (" + this.projects.length + ")";
				return "";
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
	.blocks {
		padding: 55px 35px;

		& > .sortable {
			display: inline-block;
			padding: 0 20px 40px;
			width: 25%;

			&.sortable-ghost {
				& > .block {
					opacity: 0.2;
				}
			}
		}
	}
</style>
