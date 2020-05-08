<template>
	<div id="projects" class="content">
		<SubHeader subtitle="Hub" :title="'My Projects' + dataCount" description />

		<div class="blocks">
			<div v-if="!isProjectsLoaded">Loading the projects...</div>
			<ol v-if="isProjectsLoaded">
				<li v-for="project in projects" v-bind:key="project.id">
					<Block :blockData="project" />
				</li>
			</ol>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import SubHeader from "~/components/SubHeader.vue";
	import Block from "~/components/organisms/Block.vue";

	export default {
		components: {
			SubHeader,
			Block
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				isProjectsLoaded: "projects/status"
			}),
			dataCount() {
				if (this.projects.length) return " (" + this.projects.length + ")";
				return "";
			}
		},
		created() {
			this.$store.dispatch("projects/get");
			this.$store.dispatch("projects/resetProject");
		}
	};
</script>

<style lang="scss">
	.blocks {
		padding: 55px 35px;

		& > ol {
			list-style-type: none;
			padding: 0;

			& > li {
				display: inline-block;
				padding: 0 20px 40px;
				width: 25%;
			}
		}
	}
</style>
