<template>
	<div id="projects" class="content">
		<SubHeader
			subtitle="Hub"
			title="My Projects"
			:dataCount="dataCount"
			description
		/>

		<draggable
			class="blocks"
			v-model="projects"
			group="projects"
			@start="drag = true"
			@end="drag = false"
			v-if="isProjectsLoaded"
		>
			<div
				class="sortable"
				v-for="project in projects"
				v-bind:key="project.ID"
			>
				<Block :blockData="project" />
			</div>
		</draggable>

		<!-- <draggable
			v-model="categories"
			group="projectCategories"
			@start="drag = true"
			@end="drag = false"
		>
			<div v-for="category in categories" :key="category.ID">
				{{ category.title }}
			</div>
		</draggable> -->

		<!-- <div class="blocks">
			<div v-if="!isProjectsLoaded">Loading the projects...</div>
			<ol v-if="isProjectsLoaded">
				<li v-for="project in projects" v-bind:key="project.ID">
					<Block :blockData="project" />
				</li>
			</ol>
		</div> -->
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
		// Fetch
		this.$store.dispatch("projects/getCategories");
		this.$store.dispatch("projects/get");
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
