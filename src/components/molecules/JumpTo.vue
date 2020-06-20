<template>
	<details id="jump-to">
		<summary class="selectbox" @click="fetchProjects">
			<span class="current" v-html="current"></span>
			<CaretDownIcon />
		</summary>
		<div class="details-menu sub-menu">
			<ul>
				<li :class="{active : $route.name === 'projects'}" v-if="$route.name !== 'projects'">
					<nuxt-link to="/projects/">All Projects</nuxt-link>
				</li>
				<li v-if="fetching">
					<span>Loading...</span>
				</li>
				<li
					v-else
					v-for="eachProject in projects.filter(project => !project.archived && !project.deleted)"
					:key="eachProject.ID"
					:class="{active : project.ID == eachProject.ID}"
				>
					<nuxt-link :to="`/project/${eachProject.ID}`" v-html="eachProject.title.substr(0, 15)"></nuxt-link>
				</li>
			</ul>
		</div>
	</details>
</template>

<script>
	import { mapGetters } from "vuex";
	import CaretDownIcon from "~/components/atoms/icon-caret-down.vue";

	export default {
		components: {
			CaretDownIcon
		},
		computed: {
			...mapGetters({
				projects: "projects/get",
				project: "projects/getProject",
				fetching: "projects/status"
			}),
			current() {
				if (
					(this.$route.name === "project-id" ||
						this.$route.name === "project-id-category") &&
					typeof this.project.title !== "undefined"
				)
					return this.project.title.substr(0, 15);

				return "Jump to...";
			}
		},
		methods: {
			fetchProjects() {
				if (!this.projects.length) this.$store.dispatch("projects/fetch");
			}
		}
	};
</script>

<style lang="scss">
	#jump-to {
		margin-left: 120px;

		.current {
			text-transform: capitalize;
		}
	}
</style>
